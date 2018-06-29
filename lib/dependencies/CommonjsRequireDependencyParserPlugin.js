const AbstractPlugin = require('../AbstractPlugin');
const ModuleDependency = require('./ModuleDependency');

class CommonjsRequireDependencyParserPlugin extends AbstractPlugin {
    constructor(props) {
        super(props);
        this._plugins = {
            "call require": function (expression) {
                const arg = expression.arguments;
                if (arg.length === 1) {
                    const param = arg[0];
                    const result = this.evaluateExpression(param);
                    if (result) {
                        this.applyPluginsBailResult('call require:commonjs:item', result);
                    }
                }
            },
            "call require:commonjs:item": function (result) {
                const {string, range} = result;
                const moduleDependency = new ModuleDependency({request: string, range});
                this.state.current.addDependency(moduleDependency);
            }
        }
    }
}

module.exports = CommonjsRequireDependencyParserPlugin;
