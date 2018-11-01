const Source = require('./Source');
const {SourceNode} = require('source-map');
const REPLACE_REGEX = /\n(?=.|\s)/g;


const cloneAndPrefix = (node, prefix) => {
    if (typeof node === 'string') {
        return prefix + node
    } else {
        const newNode = new SourceNode(node.line, node.column, node.source, node.children.map(item => {
            return cloneAndPrefix(item, prefix)
        }), node.name);
        newNode.sourceContents = node.sourceContents;
        return newNode
    }
};

class PrefixSource extends Source {
    constructor(prefix, source) {
        super();
        this._source = source;
        this._prefix = prefix;
    }

    source() {
        const prefix = this._prefix;
        return prefix + this._source.source().replace(REPLACE_REGEX, '\n' + prefix)
    }

    node(options) {
        const node = this._source.node(options);
        const sourceNode = new SourceNode(null, null, null, cloneAndPrefix(node, this._prefix));
        return sourceNode
    }

    updateHash(hash) {
        if (typeof this._source === 'string') {
            hash.update(this._source)
        } else {
            this._source.updateHash(hash);
        }

        if (typeof this._prefix === 'string') {
            hash.update(this._prefix);
        } else {
            this._prefix.updateHash(hash);
        }
    }
}

module.exports = PrefixSource;
