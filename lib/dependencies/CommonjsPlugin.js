const CommonjsRequireDependencyParserPlugin = require('./CommonjsRequireDependencyParserPlugin');
const RequireEnsureBlockDependencyParserPlugin = require('./RequireEnsureBlockDependencyParserPlugin');
const AbstractPlugin = require('../AbstractPlugin');

class CommonjsPlugin extends AbstractPlugin {
    constructor(props) {
        super(props);
    }

    apply(compiler) {
        compiler.parser.apply(new CommonjsRequireDependencyParserPlugin());
        compiler.parser.apply(new RequireEnsureBlockDependencyParserPlugin());
    }
}

module.exports = CommonjsPlugin;
