const AbstractPlugin = require('../AbstractPlugin');
const CommonjsRequireDependency = require('./CommonjsRequireDependency');
const RequireHeaderDependency = require('./RequireHeaderDependency');

class CommonjsRequireDependencyParserPlugin extends AbstractPlugin {
    constructor(props) {
        super(props);
        this._plugins = {
            "call require": function (expression) {
                const {arguments: arg, callee, range} = expression
                if (arg.length === 1) {
                    const param = arg[0];
                    const result = this.evaluateExpression(param);
                    if (result) {
                        this.applyPluginsBailResult('call require:commonjs:item', result);
                        this.state.current.addDependency(new RequireHeaderDependency(callee.range));
                    }
                }
            },
            "call require:commonjs:item": function (result) {
                const {string} = result;
                const moduleDependency = new CommonjsRequireDependency({request: string, range: result.range});
                this.state.current.addDependency(moduleDependency);
            }
        }
    }
}

module.exports = CommonjsRequireDependencyParserPlugin;
