const esprima = require('esprima');
const Tapable = require('tapable');
const BasicEvaluateExpression = require('./BasicEvaluateExpression');

function Parser(options) {
    Tapable.call(this);
    this.options = options;
    this.initializeEvaluate();
}

Parser.prototype = Tapable.prototype;

Parser.prototype.initializeEvaluate = function () {
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
    });

    this.plugin('evaluate ArrayExpression', expr => {
        const items = [];
        expr.elements.forEach(ele => {
            const basicExpression = this.evaluateExpression(ele);
            items.push(basicExpression);
        });
        const dep = {
            value: items,
            range: expr.range
        };
        return dep;
    });

    this.plugin('evaluate CallExpression', expr => {
        const block = this.evaluateExpression(expr.arguments[0]);
        const beforeRange = [expr.range[0], expr.arguments[1].range[0]];
        const afterRange = [expr.arguments[1].range[1], expr.arguments[1].range[1]];
        return {
            block,
            beforeRange,
            afterRange
        };
    })
};

Parser.prototype.walkStatements = function (statements) {
    statements.forEach(statement => {
        this.walkStatement(statement);
    });
};


Parser.prototype.walkStatement = function (statement) {
    const {declarations, type, body, expression} = statement;
    switch (type) {
        case 'IfStatement':
            if (Array.isArray(statement.consequent && statement.consequent.body)) {
                statement.consequent.body.forEach(variable => {
                    this.walkStatement(variable);
                })
            }
            break;
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
        case 'BlockStatement':
            if (body) {
                body.forEach(statement => {
                    this.walkStatement(statement);
                })
            }
            break;
    }
};

Parser.prototype.walkExpression = function (expression) {
    const {type, body, right} = expression;

    switch (type) {
        case 'ObjectExpression':
            if (Array.isArray(expression.properties)) {
                expression.properties.forEach(props => {
                    if (props.value) {
                        this.walkExpression(props.value);
                    }
                })
            }
            if (right) {
                this.walkExpression(right)
            }
            break;
        case 'AssignmentExpression':
            if (right) {
                this.walkExpression(right)
            }
            break;
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
            if (callee && callee.type === 'CallExpression') {
                this.walkExpression(callee);
            } else if (callee && callee.type === 'Identifier') {
                calleeName.unshift(callee.name);
                calleeName = calleeName.join('.');
                this.applyPluginsBailResult('call ' + calleeName, expression);
            }
            break;
        case 'MemberExpression':
            let memberName = [];
            let expressionObject = expression;
            if (expressionObject.object && expressionObject.object.type === 'CallExpression') {
                this.walkExpression(expressionObject.object);
            }
            while (expressionObject.type !== 'Identifier' && expressionObject.property && expressionObject.property.type === 'Identifier') {
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
        if(init){
            this.walkExpression(init);
        }
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
