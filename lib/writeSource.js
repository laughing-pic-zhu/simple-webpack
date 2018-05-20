function generateReplace(replaces, range, value) {
    replaces.push({
        from: range[0],
        value,
        end: range[1]
    })
}

function genReplacesAsync(replaces, item) {
    item.requires.forEach(req => {
        const {range, id} = req;
        if (range) {
            generateReplace(replaces, range, id);
        }
    })

    item.rangeRequires.forEach(rangeRequire => {
        generateReplace(replaces, rangeRequire, '__webpack_require__');
    });

    generateReplace(replaces, item.ensureRequires, `__webpack_require__.e(${item.chunkId}).then(`)
}

module.exports = function (module) {
    let {source, requires, rangeRequires, asyncs} = module;

    const replaces = [];
    requires.forEach(item => {
        const {id, name, range} = item;
        generateReplace(replaces, range, id);
    });

    rangeRequires.forEach(rangeRequire => {
        generateReplace(replaces, rangeRequire, '__webpack_require__');
    });

    if (Array.isArray(asyncs)) {
        asyncs.forEach(item => {
            genReplacesAsync(replaces, item);
        })
    }
    replaces.sort((a, b) => {
        return b.from - a.from;
    });


    const result = [source];
    replaces.forEach(replace => {
        const {from, value, end} = replace;
        const source = result.shift();
        result.unshift(source.substr(0, from), value, source.substr(end))
    });

    return result.join('');
};
