const RequireContextDependency = require('./RequireContextDependency');
const RequireHeaderDependency = require('./RequireHeaderDependency');

class RequireContextDependencyParserPlugin {
    apply(parser) {
        parser.plugin("call require.context", function (expression) {
            const {arguments: arg, callee, range} = expression;
            const [range1, range2] = callee.range;
            const [param, recursiveLit, regExpLit] = arg;
            const result = this.evaluateExpression(param);
            const recursive = this.evaluateExpression(recursiveLit);
            const regExp = this.evaluateExpression(regExpLit);
            this.state.current.addDependency(new RequireHeaderDependency(callee.range));
            this.state.current.addDependency(new RequireContextDependency(result.string, recursiveLit.value, regExp.regExp, [range2 + 1, range[1] - 1]))
        })
    }
}

module.exports = RequireContextDependencyParserPlugin;
