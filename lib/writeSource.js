function generateReplace(replaces, range, value) {
    replaces.push({
        from: range[0],
        value,
        end: range[1]
    })
}

module.exports = function (module) {
    let {source, requires, rangeRequires} = module;
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

    const result = [source];
    replaces.forEach(replace => {
        const {from, value, end} = replace;
        const source = result.shift();
        result.unshift(source.substr(0, from), value, source.substr(end))
    });

    return result.join('');
};
