const fs = require('fs');
const path = require('path');
const writeSource = require('./writeSource');


module.exports = function (depTree, entryPath) {
    const templateRequire = fs.readFileSync(path.join(__dirname, './templateRequire.js'));
    const buffer = [];
    buffer.push(templateRequire.toString());
    buffer.push('/******/([\n');
    const modules = Object.keys(depTree.modules);
    const len = modules.length - 1;

    modules.forEach((path, i) => {
        const module = depTree.modules[path];
        const id = module.id;
        buffer.push(`/* ${id} */\n`)
        buffer.push('/***/(function(module, exports,__webpack_require__) {\n');
        buffer.push(writeSource(module));
        if (i === len) {
            buffer.push('\n/***/})\n');
            buffer.push('/***/]);\n');
        } else {
            buffer.push('\n/***/}),\n');
        }
    });
    return buffer.join('');
};
