const Source = require('./Source');
const {SourceNode} = require('source-map');

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

    node(options) {
        const children = this.children.map(item => {
            if (typeof item === 'string') {
                return item
            } else {
                return item.node(options);
            }
        });
        const node = new SourceNode(null, null, null, children);
        return node;
    }

    listMap(options) {

    }

    sourceAndMap(options) {
        const res = this.node(options).toStringWithSourceMap({
            file: 'x'
        });
        return {
            code: res.code,
            map: res.map.toJSON()
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
