const Source = require('./Source');
const {SourceNode} = require('source-map');

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
        const node = new SourceNode(null, null, null, lines.map((line, idx) => {
            const content = idx === len - 1 ? line + '\n' : line;
            return new SourceNode(idx + 1, 0, name, content);
        }));
        node.setSourceContent(name, value);
        return node;
    }

    listMap(options) {

    }
}

module.exports = OriginalSource;
