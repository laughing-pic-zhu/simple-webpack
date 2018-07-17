const CommonjsRequireDependencyParserPlugin = require('./CommonjsRequireDependencyParserPlugin');
const RequireEnsureBlockDependencyParserPlugin = require('./RequireEnsureBlockDependencyParserPlugin');
const ModuleDependency = require('./ModuleDependency');
const AbstractPlugin = require('../AbstractPlugin');

class CommonjsPlugin extends AbstractPlugin {
    constructor(props) {
        super(props);
    }

    apply(compiler) {
        compiler.plugin('compilation', function (compilation, params) {
            const normalModuleFactory = params.normalModuleFactory;
            compilation.dependencyFactories.set(ModuleDependency, normalModuleFactory);
        });
        compiler.parser.apply(new CommonjsRequireDependencyParserPlugin());
        compiler.parser.apply(new RequireEnsureBlockDependencyParserPlugin());
    }
}

module.exports = CommonjsPlugin;
