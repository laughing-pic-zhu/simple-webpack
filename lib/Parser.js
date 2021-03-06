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
                return new BasicEvaluateExpression().setString(value).setRange(range);
            case 'number':
                return new BasicEvaluateExpression().setNumber(value).setRange(range);
            case 'boolean':
                return new BasicEvaluateExpression().setBoolean(value).setRange(range);
        }
        if (value instanceof RegExp) {
            return new BasicEvaluateExpression().setRegExp(value).setRange(range);
        }
    });

    this.plugin('evaluate MemberExpression', expr => {
        const exprName = this.getNameForExpression(expr);
        if (exprName) {
            const result = this.applyPluginsBailResult1('evaluate Identifier ' + exprName.name, expr);
            if (result) return result
            return new BasicEvaluateExpression().setIdentifier(exprName.name).setRange(expr.range)
        }
    });

    this.plugin('evaluate Identifier', expr => {
        return new BasicEvaluateExpression().setRange(expr.range)
    });

    this.plugin('evaluate BinaryExpression', expr => {
        return new BasicEvaluateExpression().setRange(expr.range)
    });

    this.plugin('evaluate ArrayExpression', expr => {
        const items = [];
        expr.elements.forEach(ele => {
            const basicExpression = this.evaluateExpression(ele);
            items.push(basicExpression);
        });
        return new BasicEvaluateExpression().setArray(items).setRange(expr.range)
    });

    this.plugin('evaluate CallExpression', expr => {
        if (expr.arguments.length >= 2) {
            const block = this.evaluateExpression(expr.arguments[0]);
            const beforeRange = [expr.range[0], expr.arguments[1].range[0]];
            const afterRange = [expr.arguments[1].range[1], expr.arguments[1].range[1]];
            return {
                block,
                beforeRange,
                afterRange
            };
        } else {
            return {}
        }

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
            const result = this.applyPluginsBailResult1("statement if", statement);
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
        case 'ReturnStatement':
            if (statement.argument) {
                const left = statement.argument.left;
                if (left) {
                    this.walkExpression(left);
                }
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
            if (expression.arguments[0]) {
                this.walkExpression(expression.arguments[0]);
            }
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
            if(idenName==='__webpack_hash__'){
                console.log(1);
            }
            this.applyPluginsBailResult('expression ' + idenName, expression);
            break;
    }
};

Parser.prototype.walkVariableDeclaration = function (declarations) {
    declarations.forEach(declaration => {
        const {init, id} = declaration;
        this.scope.declarations.push(id.name);
        if (init) {
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

Parser.prototype.getNameForExpression = function (expression) {
    const name = [];
    while (expression.type === 'MemberExpression' && expression.property.type === 'Identifier') {
        name.push(expression.property.name);
        expression = expression.object;
    }
    name.push(expression.name);

    let prefix;
    for (let i = name.length; i >= 1; i--) {
        prefix = name[i] + '.'
    }
    return {
        name: prefix + name[0]
    }
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
