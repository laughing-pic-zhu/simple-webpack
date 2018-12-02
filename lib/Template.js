const Tapable = require('tapable');
const ConcatSource = require('./ConcatSource');
const FUNCTION_CONTENT_REGEX = /^function\s?\(\)\s?\{\n?|\n?\}$/g;
const INDENT_MULTILINE_REGEX = /^\t/mg;

class Template extends Tapable {
    constructor(props) {
        super(props);
    }

    static getFunctionContent(fn) {
        return fn.toString().replace(FUNCTION_CONTENT_REGEX, "").replace(INDENT_MULTILINE_REGEX, "");
    }

    asString(str) {
        if (Array.isArray(str)) {
            return str.join('\n');
        }
        return str;
    }

    setModules(modules) {
        this.modules = modules;
    }

    indent(str) {
        if (Array.isArray(str)) {
            return str.map(this.indent.bind(this)).join('\n')
        } else {
            str = str.trimRight();
            if (!str) return '';
            const ind = str[0] === '\n' ? '' : '\t';
            return ind + str.replace(/\n([^\n])/g, "\n\t$1");
        }
    }

    prefix(str, prefix) {
        if (Array.isArray(str)) {
            str = str.join('\n');
        }
        str = str.trim()
        return prefix + str.replace(/\n([^\n)])/g, '\n ' + prefix + '$1');
    }

    getModulesArrayBounds(modules) {
        let minId = 0;
        let maxId = 0;
        modules.forEach(module => {
            if (minId > module.id) {
                minId = module.id;
            }
            if (maxId < module.id) {
                maxId = module.id
            }
        });

        const arrayBound = maxId;
        const objectBound = modules.map(module => {
            return (module.id + '').length + 2
        }).reduce((a, b) => a + b, -1);

        return arrayBound < objectBound ? [minId, maxId] : false;
    }

    renderChunk(chunk, moduleTemplate,dependencyTemplates) {
        const buf = new ConcatSource();
        const bounds = this.getModulesArrayBounds(chunk.modules);
        const obj = {};
        chunk.modules.forEach(module => {
            obj[module.id] = module;
        });
        if (bounds) {
            buf.add('[\n');
            const [minId, maxId] = bounds;
            const array = [];

            for (let i = minId; i <= maxId; i++) {
                array.push({
                    id: i,
                    module: obj[i]
                })
            }

            array.forEach((bound, i) => {
                if (i !== 0) {
                    buf.add(',\n');
                }
                const {id, module} = bound;
                buf.add(`/* ${id} */`);
                if (module) {
                    buf.add('\n/***/ (function(module, exports, __webpack_require__) {\n');
                    buf.add(moduleTemplate.render(module, chunk,dependencyTemplates));
                    buf.add('\n/***/ })');
                }
            });
            buf.add('\n/******/ ]);');
        } else {
            buf.add('{\n');
            Object.keys(obj).forEach((id, index) => {
                if (index !== 0) {
                    buf.add(',\n');
                }
                const module = obj[id];
                buf.add(`/***/${id}:`);
                buf.add('\n/***/ (function(module, exports, __webpack_require__) {\n');
                buf.add(moduleTemplate.render(module, chunk,dependencyTemplates));
                buf.add('\n/***/ })');
            })
            buf.add('\n/******/ });');
        }
        return buf;
    }

}

module.exports = Template;
