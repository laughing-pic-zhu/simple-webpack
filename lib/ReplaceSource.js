const Source = require('./Source');

class ReplaceSource extends Source {
    constructor(source) {
        super();
        this._source = source;
        this.replacements = [];
    }

    replace(start, end, value) {
        this.replacements.push(
            {
                start,
                end,
                value
            }
        )
    }

    getStr(start, end) {
        return this._source.source().substr(start, end);
    }

    source() {
        this.replacements.sort(function (a, b) {
            return b.start - a.start
        });
        const result = [this._source.source()];
        this.replacements.forEach(function (repl) {
            const {start, value, end} = repl;
            const source = result.pop();
            result.push(source.substr(end), value, source.substr(0, start));
        });
        return result.reverse().join('')
    }
}

module.exports = ReplaceSource;
