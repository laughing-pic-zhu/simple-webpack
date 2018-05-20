const fs = require('fs');
const path = require('path');
const writeSource = require('./writeSource');


module.exports = function (depTree, chunk) {
    const buffer = [];
    const chunkId=chunk.id;
    if (chunkId=== 0) {
        const templateRequire = fs.readFileSync(path.join(__dirname, './templateRequire.js'));
        buffer.push(templateRequire.toString());
        buffer.push('/******/([\n');
    } else {
        buffer.push(`webpackJsonp([${chunkId}],[\n`);
    }
    const {modules, modulesArray,mapIdToName} = depTree;
    const len = modulesArray.length - 1;
    modulesArray.forEach((path, i) => {
        const module = modules[path];
        const id = module.id;

        if (chunk.modules[id] === 'include') {
            buffer.push(`/* ${id} */\n`);
            buffer.push('/***/(function(module, exports,__webpack_require__) {\n');
            buffer.push(writeSource(module));
            buffer.push('\n/***/}),\n');
        } else {
            buffer.push(`/* ${id} */,\n`);
        }
        if (i === len) {
            buffer.push('/***/]);\n');
        }
    });
    return buffer.join('');
};
