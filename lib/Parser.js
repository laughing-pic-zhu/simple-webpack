const esprima = require('esprima');
const Tapable = require('tapable');
const BasicEvaluateExpression = require('./BasicEvaluateExpression');

function Parser(options) {
    Tapable.call(this);
    this.options = options;
    this.initializeEvaluate();
}

Parser.prototype = Tapable.prototype;

Parser.prototype.initializeEvaluate =function () {
    this.plugin('evaluate Literal', (expr) => {
        const {value, range} = expr;
        switch (typeof value) {
            case 'string':
                return new BasicEvaluateExpression().setString(expr.value).setRange(range);
            case 'number':
                return new BasicEvaluateExpression().setNumber(expr.value).setRange(range);
            case 'boolean':
                return new BasicEvaluateExpression().setBoolean(expr.value).setRange(range);
        }
    })
};

Parser.prototype.walkStatements = function (statements) {
    statements.forEach(statement => {
        this.walkStatement(statement);
    });
};


Parser.prototype.walkStatement = function (statement) {
    const {declarations, type, callee, arguments, body, expression} = statement;
    switch (type) {
        case 'VariableDeclaration':
            if (declarations) {
                this.walkVariableDeclaration(declarations);
            }
            break;
        case 'FunctionDeclaration':
            this.scope.declarations.push(statement.id.name);
            if (body) {
                const b = body.body;
                if (Array.isArray(b)) {
                    this.walkStatements(b);
                }
            }
            break;
        case 'ExpressionStatement':
            this.walkExpression(expression);
            break;
    }
};

Parser.prototype.walkExpression = function (expression) {
    const {type, body} = expression;

    switch (type) {
        case 'FunctionExpression':
            if (body.type === 'BlockStatement') {
                this.walkStatement(body);
            }
            break;
        case 'CallExpression':
            let calleeName = [];
            let callee = expression.callee;
            while (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') {
                calleeName.unshift(callee.property.name);
                callee = callee.object;
            }
            if (callee && callee.type === 'Identifier') {
                calleeName.unshift(callee.name);
                calleeName = calleeName.join('.');
                this.applyPluginsBailResult('call ' + calleeName, expression);
            }
            break;
        case 'MemberExpression':
            let memberName = [];
            let expressionObject = expression;
            while (expressionObject.type !== 'Identifier' && expressionObject.property.type === 'Identifier') {
                memberName.unshift(expressionObject.property.name)
                expressionObject = expressionObject.object;
            }
            memberName.unshift(expressionObject.name);
            memberName = memberName.join('.');
            this.applyPluginsBailResult('expression ' + memberName, expression);
            break;
        case 'Identifier':
            let idenName = expression.name;
            this.applyPluginsBailResult('expression ' + idenName, expression);
            break;
    }
};

Parser.prototype.walkVariableDeclaration = function (declarations) {
    declarations.forEach(declaration => {
        const {init, id} = declaration;
        this.scope.declarations.push(id.name);
        this.walkExpression(init);
    })
};

Parser.prototype.parseString = function (expression) {
    switch (expression.type) {
        case 'Literal':
            return expression.value + '';
        case 'BinaryExpression':
            if (expression.operator === '+') {
                return this.parseString(expression.left) + this.parseString(expression.right);
            }
    }
};

Parser.prototype.evaluateExpression = function (expression) {
    return this.applyPluginsBailResult('evaluate ' + expression.type, expression);
};

Parser.prototype.parse = function (source, initialState) {
    const ast = esprima.parse(source, {range: true});
    this.scope = {
        declarations: [],
    };
    this.state = initialState;
    this.walkStatements(ast.body);
    const state = this.state;
    return state;
};

module.exports = Parser;
