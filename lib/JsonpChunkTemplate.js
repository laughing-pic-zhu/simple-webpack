const RawSource = require('./RawSource');

class JsonpChunkTemplate {
    render(chunk, compiler) {
        const buf = [];
        buf.push(`webpackJsonp([${chunk.id}], [\n`);
        const modules = {};
        chunk.modules.forEach(module => {
            modules[module.id] = module;
        });
        compiler.modules.forEach((module, i) => {
            if (i !== 0) {
                buf.push(',\n');
            }
            if (modules[module.id]) {
                buf.push(`/* ${module.id} */\n`);
                buf.push('/***/ (function(module, exports, __webpack_require__) {\n');
                buf.push(module.source());
                buf.push('\n/***/ })');
            } else {
                buf.push(`/* ${module.id} */`);
            }

        });
        buf.push('\n/******/ ]);');
        return new RawSource(buf.join(''))
    }
}

module.exports = JsonpChunkTemplate;
