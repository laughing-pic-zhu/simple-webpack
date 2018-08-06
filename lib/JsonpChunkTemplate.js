const RawSource = require('./RawSource');
const Template = require('./Template');

class JsonpChunkTemplate extends Template {
    render(chunk, compiler) {
        const buf = [];
        buf.push(`webpackJsonp([${chunk.id}], `);
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
            Object.keys(obj).forEach(id => {
                const module = obj[id];
                buf.push(`/***/${id}:`);
                buf.push('\n/***/ (function(module, exports, __webpack_require__) {\n');
                buf.push(module.source());
                buf.push('\n/***/ })');
            })
            buf.push('\n/******/ });');
        }

        return new RawSource(buf.join(''))
    }
}

module.exports = JsonpChunkTemplate;
