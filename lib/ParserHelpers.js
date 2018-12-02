const BasicEvaluateExpression = require("./BasicEvaluateExpression");
const ConstDependency = require("./dependencies/ConstDependency");

exports.evaluateToIdentifier = function (identifier, truthy) {
    return function identifierExpression(expr) {
        let evex = new BasicEvaluateExpression().setIdentifier(identifier).setRange(expr.range);
        if (truthy === true) evex = evex.setTruthy();
        else if (truthy === false) evex = evex.setFalsy();
        return evex;
    };
};
