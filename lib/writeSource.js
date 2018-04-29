const fs = require('fs');
const path = require('path');

function generateReplace(replaces, range, value) {
    replaces.push({
        from: range[0],
        value,
        end: range[1]
    })
}

function replaceRange(result, replaces) {
    replaces.forEach(replace => {
        const {from, value, end} = replace;
        const source = result.shift();
        result.unshift(source.substr(0, from), value, source.substr(end))
    });
    return result.join('');
}


module.exports = function (depTree, entryPath) {
    const templateRequire = fs.readFileSync(path.join(__dirname, './templateRequire.js'));
    const mainId = depTree.mapNameToId[entryPath];
    const buffer = [];
    let template = templateRequire.toString();
    template = templateRequire.toString().replace('${mainId}', mainId);
    buffer.push(template);
    buffer.push('/******/([\n');
    const modules = Object.keys(depTree.modules);
    const len = modules.length - 1;


    modules.forEach((path, i) => {
        const tree = depTree.modules[path];
        let {id, source, requires, rangeRequires} = tree;
        buffer.push(`/* ${id} */\n`)
        buffer.push('/***/(function(module, exports,__webpack_require__) {\n');
        const result = [source];
        const replaces = [];

        requires.forEach(item => {
            const {id, name, range} = item;
            generateReplace(replaces, range, id);
        });
        rangeRequires.forEach(rangeRequire => {
            generateReplace(replaces, rangeRequire, '__webpack_require__');
        });

        replaces.sort((a, b) => {
            return b.from - a.from;
        });

        source = replaceRange(result, replaces);
        buffer.push(source);
        if (i === len) {
            buffer.push('\n/***/})\n');
            buffer.push('/***/]);\n');
        } else {
            buffer.push('\n/***/}),\n');
        }
    });
    return buffer.join('');
};
