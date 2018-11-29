const AbstractPlugin = require('../AbstractPlugin');
const RequireEnsureItemDependency = require('./RequireEnsureItemDependency');
const RequireEnsureDependenciesBlock = require('./RequireEnsureDependenciesBlock');

class RequireEnsureBlockDependencyParserPlugin extends AbstractPlugin {
    constructor(props) {
        super(props);
        this._plugins = {
            "call require.ensure": function (expression) {
                const {block, beforeRange, afterRange} = this.evaluateExpression(expression);
                const dep = new RequireEnsureDependenciesBlock({beforeRange, afterRange});
                const old = this.state.current;
                this.state.current.addBlock(dep);
                this.state.current = dep;
                block.value.forEach(val => {
                    if (val.isString()) {
                        dep.addDependency(new RequireEnsureItemDependency({request: val.string}));
                    }
                });
                this.walkExpression(expression.arguments[1]);
                this.state.current = old;
            }
        }
    }
}

module.exports = RequireEnsureBlockDependencyParserPlugin;
