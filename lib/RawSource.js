const Source = require('./Source');
const {SourceNode} = require('source-map');

class RawSource extends Source {
    constructor(value) {
        super();
        this._source = value;
    }

    source() {
        return this._source
    }

    node() {
        return new SourceNode(null, null, null, this._source);
    }

    listNode() {

    }

    updateHash(hash) {
        hash.update(this._source)
    }
}

module.exports = RawSource;
