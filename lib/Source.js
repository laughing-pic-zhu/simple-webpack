class Source {
    constructor() {
        this._result = null;
    }

    source() {
        if (!this._result) {
            this._result = this._bake();
        }
        return this._result.source;
    }

    size() {
        if (!this._result) {
            this._result = this._bake();
        }
        return this._result.source.length;
    }
}

module.exports = Source;
