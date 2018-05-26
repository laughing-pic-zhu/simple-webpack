const fs = require('fs');
const path = require('path');
const writeSource = require('./writeSource');


module.exports = function (depTree, chunk) {
    const chunkId = chunk.id;
    const {modules} = depTree;
    const buffer=[];
    Object.keys(modules).forEach(key => {
        const module = modules[key];
        const id = module.id;
        if (chunk.modules[id] === 'include') {
            buffer.push(`/* ${id} */\n`);
            buffer.push('/***/(function(module, exports,__webpack_require__) {\n');
            buffer.push(writeSource(module));
            buffer.push('\n/***/}),\n');
        } else if (chunkId !== 0) {
            buffer.push(`/* ${id} */,\n`);
        }
    });
    buffer.push('/***/]);\n');
    return buffer.join('');
};
