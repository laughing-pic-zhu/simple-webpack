const AbstractPlugin = require('../AbstractPlugin');
const CommonjsRequireDependency = require('./CommonjsRequireDependency');

class CommonjsRequireDependencyParserPlugin extends AbstractPlugin {
    constructor(props) {
        super(props);
        this._plugins = {
            "call require": function (expression) {
                const {arguments:arg,callee,range}=expression
                if (arg.length === 1) {
                    const param = arg[0];
                    const result = this.evaluateExpression(param);
                    if (result) {
                        this.applyPluginsBailResult('call require:commonjs:item', result,range);
                    }
                }
            },
            "call require:commonjs:item": function (result,range) {
                const {string} = result;
                const moduleDependency = new CommonjsRequireDependency({request: string, range});
                this.state.current.addDependency(moduleDependency);
            }
        }
    }
}

module.exports = CommonjsRequireDependencyParserPlugin;
