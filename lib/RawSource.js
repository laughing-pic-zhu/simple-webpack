const Source = require('./Source');

class RawSource extends Source {
    constructor(value) {
        super();
        this._source = value;
    }

    source() {
        return this._source
    }
}

module.exports = RawSource;
