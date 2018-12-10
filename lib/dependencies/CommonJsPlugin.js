const CommonjsRequireDependencyParserPlugin = require('./CommonjsRequireDependencyParserPlugin');
const RequireEnsureBlockDependencyParserPlugin = require('./RequireEnsureBlockDependencyParserPlugin');
const CommonjsRequireDependency = require('./CommonjsRequireDependency');
const RequireHeaderDependency = require('./RequireHeaderDependency');
const AbstractPlugin = require('../AbstractPlugin');

class CommonjsPlugin extends AbstractPlugin {
    constructor(props) {
        super(props);
    }

    apply(compiler) {
        compiler.plugin('compilation', function (compilation, params) {
            const {nullFactory,normalModuleFactory} = params;
            compilation.dependencyTemplates.set(CommonjsRequireDependency, new CommonjsRequireDependency.Template())
            compilation.dependencyFactories.set(CommonjsRequireDependency, normalModuleFactory);
            compilation.dependencyFactories.set(RequireHeaderDependency, nullFactory);
            compilation.dependencyTemplates.set(RequireHeaderDependency, new RequireHeaderDependency.Template())

        });
        compiler.parser.apply(new CommonjsRequireDependencyParserPlugin());
        compiler.parser.apply(new RequireEnsureBlockDependencyParserPlugin());
    }
}

module.exports = CommonjsPlugin;
