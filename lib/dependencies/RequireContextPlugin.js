const RequireContextDependencyParserPlugin = require('./RequireContextDependencyParserPlugin');
const RequireContextDependency = require('./RequireContextDependency');

class RequireContextPlugin {
    constructor(extensions) {
        this.extensions = extensions;
    }

    apply(compiler) {
        compiler.plugin('compilation', (compilation, params) => {
            const contextModuleFactory = params.contextModuleFactory;
            compilation.dependencyFactories.set(RequireContextDependency, contextModuleFactory);
            compilation.dependencyTemplates.set(RequireContextDependency, new RequireContextDependency.Template());
            contextModuleFactory.plugin('alternatives', (items, callback) => {
                const alternatives = items.map(obj => {
                    return this.extensions.map(ext => {
                        return {
                            request: obj.request.substr(0, obj.request.length - ext.length),
                            context: obj.context
                        }
                    }).concat(items)
                }).reduce((a, b) => a.concat(b), [])

                callback(null, alternatives)
            });

        })
        compiler.parser.apply(new RequireContextDependencyParserPlugin())
    }
}

module.exports = RequireContextPlugin;
