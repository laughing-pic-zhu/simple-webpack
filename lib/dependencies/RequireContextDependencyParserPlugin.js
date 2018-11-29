const RequireContextDependency = require('./RequireContextDependency');

class RequireContextDependencyParserPlugin {
    apply(parser) {
        parser.plugin("call require.context", function (expression) {
            const arg = expression.arguments;
            const callee = expression.callee;
            this.state.current.addRequire(callee.range);
            const [param, recursiveLit, regExpLit] = arg;
            const result = this.evaluateExpression(param);
            const recursive = this.evaluateExpression(recursiveLit);
            const regExp = this.evaluateExpression(regExpLit);
            this.state.current.addDependency(new RequireContextDependency(result.string, recursiveLit.value, regExp.regExp, callee.range))
        })
    }
}

module.exports = RequireContextDependencyParserPlugin;
