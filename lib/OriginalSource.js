const Source = require('./Source');
const {SourceNode} = require('source-map');

function isSplitter(c) {
    switch (c) {
        case 10: // \n
        case 13: // \r
        case 59: // ;
        case 123: // {
        case 125: // }
            return true;
    }
    return false;
}

function _splitCode(code) {
    let i = 0;
    let j = 0;
    const result = [];
    for (; i < code.length; i++) {
        if (isSplitter(code.charCodeAt(i))) {
            while (isSplitter(code.charCodeAt(++i))) ;
            result.push(code.substring(j, i));
            j = i;
        }
    }
    if (j < code.length) {
        result.push(code.substr(j));
    }
    return result
}

class OriginalSource extends Source {
    constructor(value, name) {
        super();
        this._value = value;
        this._name = name;
    }

    source() {
        return this._value;
    }

    node(options) {
        const value = this._value;
        const name = this._name;
        const lines = value.split('\n');
        const len = lines.length;
        const columns = options.columns;
        const node = new SourceNode(null, null, null, lines.map((line, idx) => {
            let i = 0;
            const content = idx !== len - 1 ? line + '\n' : line;
            if (/^\s*$/.test(content)) return content;
            if (columns === false) {
                return new SourceNode(idx + 1, 0, name, content);
            }
            return new SourceNode(null, null, null, _splitCode(content).map(item => {
                const result= new SourceNode(idx + 1, i, name, item);
                i = i + item.length;
                return result
            }))
        }));

        node.setSourceContent(name, value);
        return node;
    }

    listMap(options) {

    }
}

module.exports = OriginalSource;
