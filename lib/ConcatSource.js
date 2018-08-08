const Source = require('./Source');

class ConcatSource extends Source {
    constructor() {
        super();
        this.children = [];
    }

    add(source) {
        if (source instanceof ConcatSource) {
            this.children = this.children.concat(source.children);
        } else {
            this.children.push(source);
        }
    }

    source() {
        const data = this.children.map(child => {
            if (typeof child === 'string') {
                return child;
            } else {
                return child.source();
            }
        });
        return data.join('')
    }
}

module.exports = ConcatSource;
