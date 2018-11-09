const Module = require('./Module');
const RawSource = require('./RawSource');

class MultiModule extends Module {
    constructor(props) {
        super(props);
        const {dependencies} = props;
        this.dependencies = dependencies;
        this.built = false;
    }

    doBuild(callback) {
        this.built = true;
        callback();
    }

    updateHash(hash) {
        hash.update('multi module');
        hash.update(this.name || '');
        super.updateHash(hash);
    }

    source() {
        const str = [];
        const len = this.dependencies.length;
        this.dependencies.forEach((dependency, i) => {
            const module = dependency.module;
            if (module) {
                if (len - 1 === i) {
                    str.push('module.exports=')
                }
                str.push('__webpack_require__(');
                str.push(module.id);
                str.push(');\n');
            }
        })
        return new RawSource(str.join(''));
    }
}

module.exports = MultiModule
