const Source = require('./Source');
const {SourceNode} = require('source-map');

class CachedSource extends Source {
    constructor(source) {
        super();
        this._source = source;
        this._cachedSource = undefined;
        if (source.node) {
            this.node = function (options) {
                return source.node(options);
            }
        }
        if (source.listMap) {
            this.listMap = function (options) {
                source.listMap(options);
            }
        }
    }

    source() {
        if (typeof this._cachedSource !== 'undefined') {
            return this._cachedSource
        }
        return this._cachedSource = this._source.source()
    }
}

module.exports = CachedSource;
