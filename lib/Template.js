const Tapable = require('tapable');


class Template extends Tapable {
    constructor(props) {
        super(props);
    }

    asString(str) {
        if (Array.isArray(str)) {
            return str.join('\n');
        }
        return str;
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

    renderChunk(chunk) {
        const buf = [];
        const bounds = this.getModulesArrayBounds(chunk.modules);
        const obj = {};
        chunk.modules.forEach(module => {
            obj[module.id] = module;
        });
        if (bounds) {
            buf.push('[\n');
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
                    buf.push(',\n');
                }
                const {id, module} = bound;
                buf.push(`/* ${id} */`);
                if (module) {
                    buf.push('\n/***/ (function(module, exports, __webpack_require__) {\n');
                    buf.push(module.source());
                    buf.push('\n/***/ })');
                }
            });
            buf.push('\n/******/ ]);');
        } else {
            buf.push('{\n');
            Object.keys(obj).forEach((id,index) => {
                if (index !== 0) {
                    buf.push(',\n');
                }
                const module = obj[id];
                buf.push(`/***/${id}:`);
                buf.push('\n/***/ (function(module, exports, __webpack_require__) {\n');
                buf.push(module.source());
                buf.push('\n/***/ })');
            })
            buf.push('\n/******/ });');
        }
        return buf.join('');
    }

}

module.exports = Template;
