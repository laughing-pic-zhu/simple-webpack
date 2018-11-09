const MultiEntryDependency = require('./dependencies/MultiEntryDependency');
const SingleEntryDependency = require('./dependencies/SingleEntryDependency');
const MultiModuleFactory = require('./MultiModuleFactory');

class MultiEntryPlugin {
    constructor(props) {
        const {context, name, dependencies} = props;
        this.context = context;
        this.name = name;
        this.dependencies = dependencies;
    }

    apply(compiler) {
        compiler.plugin('compilation', function (compilation, params) {
            const normalModuleFactory = params.normalModuleFactory;
            compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);
            compilation.dependencyFactories.set(MultiEntryDependency, new MultiModuleFactory());
        });

        compiler.plugin('make', (compilation, callback) => {
            compilation.addEntry(this.context, MultiEntryPlugin.createDependcies(this.dependencies), this.name, callback);
        })
    }

    static createDependcies(dependencies) {
        const dep = {
            class: MultiEntryDependency
        };
        dep.dependencies = dependencies.map(dependency => {
            return new SingleEntryDependency({request: dependency})
        })

        return dep;

    }
}

module.exports = MultiEntryPlugin;
