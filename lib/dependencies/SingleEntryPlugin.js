const SingleEntryDependency = require('./SingleEntryDependency');

class SingleEntryPlugin {
    constructor(props) {
        const {context, name, entry} = props;
        this.context = context;
        this.name = name;
        this.entry = entry;
    }

    apply(compiler) {
        compiler.plugin('compilation', function (compilation, params) {
            const normalModuleFactory = params.normalModuleFactory;
            compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);
        });

        compiler.plugin('make', (compilation, callback) => {
            compilation.addEntry(this.context, new SingleEntryDependency({request: this.entry}), this.name, callback);
        })
    }
}

module.exports = SingleEntryPlugin;
