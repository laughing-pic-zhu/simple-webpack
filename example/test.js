const Parser = require('../lib/Parser');

const a = 'test([111,222])';

const test = new Parser({});

test.plugin('call test', function (expr) {
    console.log(expr.arguments[0]);
    console.log(this.evaluateExpression(expr))
    return true
});

test.plugin('expression a.b.c', function (expr) {
    console.log(this.scope);
    return true
});

test.plugin('evaluate 111', function (expr) {
    return true
});

test.parse(a);

