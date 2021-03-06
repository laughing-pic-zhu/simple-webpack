const SingleEntryDependency = require('./dependencies/SingleEntryDependency');

class SingleEntryPlugin {
    constructor(context, entry, name) {
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
