const Source = require('./Source');
const REPLACE_REGEX = /\n(?=.|\s)/g;

class PrefixSource extends Source {
    constructor(prefix, source) {
        super();
        this._source = source;
        this._prefix = prefix;
    }

    source() {
        const prefix = this._prefix;
        return prefix + this._source.replace(REPLACE_REGEX, '\n' + prefix)
    }
}

module.exports = PrefixSource;
