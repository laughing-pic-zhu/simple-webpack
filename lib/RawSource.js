const Source = require('./Source');

class RawSource extends Source {
    constructor(value) {
        super();
        this._source = value;
    }

    _bake() {
        return {
            source: this._source
        }
    }
}

module.exports = RawSource;
