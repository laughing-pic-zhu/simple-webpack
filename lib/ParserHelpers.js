const BasicEvaluateExpression = require("./BasicEvaluateExpression");
const ConstDependency = require("./dependencies/ConstDependency");
const ModuleDependency = require("./dependencies/CommonjsRequireDependency");

exports.evaluateToIdentifier = function (identifier, truthy) {
    return function identifierExpression(expr) {
        let evex = new BasicEvaluateExpression().setIdentifier(identifier).setRange(expr.range);
        if (truthy === true) evex = evex.setTruthy();
        else if (truthy === false) evex = evex.setFalsy();
        return evex;
    };
};


exports.toConstantDependency = function (value) {
    return function constDependency(expr) {
        let dep = new ConstDependency(value, expr.range);
        this.state.current.addDependency(dep);
        return true
    };
};

