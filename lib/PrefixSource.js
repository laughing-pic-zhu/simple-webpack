const Source = require('./Source');
const {SourceNode} = require('source-map');
const REPLACE_REGEX = /\n(?=.|\s)/g;


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
        const sourceNode = new SourceNode(null, null, null, this._source.node(options));
        return sourceNode
    }
}

module.exports = PrefixSource;
