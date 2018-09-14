const Source = require('./Source');
const {SourceNode} = require('source-map');

class CachedSource extends Source {
    constructor(source) {
        super();
        this._source = source;
        this._cachedSource = undefined;
        this._cachedMaps = {};
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

    sourceAndMap(options) {
        const key = JSON.stringify(options);
        if (this._cachedSource !== undefined && key in this._cachedMaps) {
            return {
                code: this._cachedSource,
                map: this._cachedMaps[key]
            }
        } else if (key in this._cachedMaps) {
            return {
                code: this._cachedSource = this._source.source(),
                map: this._cachedMaps[key]
            }
        }
        const res = this.node(options).toStringWithSourceMap({
            file: 'x'
        });
        this._cachedSource = res.code;
        this._cachedMaps[key] = res.map.toJSON();
        return {
            code: res.code,
            map: res.map.toJSON()
        }
    }
}

module.exports = CachedSource;
