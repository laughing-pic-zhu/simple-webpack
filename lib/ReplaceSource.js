const Source = require('./Source');

class ReplaceSource extends Source {
    constructor(source) {
        super(source);
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

    _bake() {
        this.replacements.sort(function (a, b) {
            return b.start - a.start
        });
        const result = [this._source.source()];
        this.replacements.forEach(function (repl) {
            const {start, value, end} = repl;
            const source = result.pop();
            result.push(source.substr(end), value, source.substr(0, start));
        });
        return {
            source: result.reverse().join('')
        }
    }
}

module.exports = ReplaceSource;
