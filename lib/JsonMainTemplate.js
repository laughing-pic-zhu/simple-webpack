const fs = require('fs');

class JsonMainTemplate {
    render(chunk, callback) {
        const buf = [];
        fs.readFile(__dirname + '/templateSingle.js', (err, values) => {
            if (!err) {
                buf.push(values.toString());
                buf.push('/******/ ([\n');
                chunk.modules.forEach((module, i) => {
                    if (i !== 0) {
                        buf.push(',\n');
                    }
                    buf.push(`/* ${module.id} */\n`);
                    buf.push('/***/ (function(module, exports, __webpack_require__) {\n');
                    buf.push(module.source());
                    buf.push('/***/ })');
                });
                buf.push('\n/******/ ]);');
                callback(buf.join(''));
            }
        });
    }
}

module.exports = JsonMainTemplate;
