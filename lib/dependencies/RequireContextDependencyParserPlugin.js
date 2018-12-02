const RequireContextDependency = require('./RequireContextDependency');

class RequireContextDependencyParserPlugin {
    apply(parser) {
        parser.plugin("call require.context", function (expression) {
            const {arguments: arg, callee, range} = expression;
            const [range1, range2] = range;
            const [param, recursiveLit, regExpLit] = arg;
            const result = this.evaluateExpression(param);
            const recursive = this.evaluateExpression(recursiveLit);
            const regExp = this.evaluateExpression(regExpLit);
            this.state.current.addDependency(new RequireContextDependency(result.string, recursiveLit.value, regExp.regExp, [range1, range2]))
        })
    }
}

module.exports = RequireContextDependencyParserPlugin;
