class Source {
    constructor(result) {
        this._result = result;
    }

    source() {
        return this._result.source;
    }

    size() {
        return this._result.source.length;
    }
}

module.exports = Source;
