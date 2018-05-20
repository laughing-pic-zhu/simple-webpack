const esprima = require('esprima');

const walkStatements = function (context, statements) {
    statements.forEach(statement => {
        walkStatement(context, statement);
    });
};

const walkStatement = function (context, statement) {
    const {declarations, type, callee, arguments, body, expression} = statement;
    switch (type) {
        case 'VariableDeclaration':
            if (declarations) {
                walkVariableDeclaration(context, declarations);
            }
            break;
        case 'FunctionDeclaration':
            if (body) {
                const b = body.body;
                if (Array.isArray(b)) {
                    walkStatements(context, b);
                }
            }
            break;
        case 'ExpressionStatement':
            walkExpression(context, expression);
            break;
    }
};


const walkExpression = function (context, expression) {
    const {type, callee, arguments, body} = expression;
    switch (type) {
        case 'FunctionExpression':
            if (body.type === 'BlockStatement') {
                walkStatement(body);
            }
        case 'CallExpression':
            if (callee && callee.type === 'Identifier' && callee.name === 'require' && arguments && arguments.length >= 1) {
                const {name, range: rangeRequires} = callee;
                context.rangeRequires.push(rangeRequires);
                if (name === 'require') {
                    arguments.forEach(argument => {
                        const {value, range} = argument;
                        context.requires.push({
                            name: value,
                            range,
                        })
                    });
                }
            } else if (callee && callee.type === 'MemberExpression' &&
                callee.object && callee.object.name === 'require' &&
                callee.property && callee.property.name === 'ensure') {
                if (Array.isArray(arguments) && arguments[0] && arguments[1]) {
                    const sure = arguments[0];
                    const func = arguments[1];
                    const body = func.body;
                    const newContext = {
                        requires: [],
                        asyncs: [],
                        rangeRequires: [],
                        ensureRequires: [callee.range[0], func.range[0]]
                    };
                    context.asyncs.push(newContext);
                    sure.elements.forEach(element => {
                        const {value} = element;
                        const obj = {
                            name: value,
                        };
                        newContext.requires.push(obj)
                    });

                    if (body && body.body) {
                        if (Array.isArray(body.body)) {
                            walkStatements(newContext, body.body);
                        }
                    }
                } else {
                    console.error('参数必须为数组')
                }
            }
            break;
    }
};


const ensureFunction = function () {

};

const walkVariableDeclaration = function (context, declarations) {
    declarations.forEach(declaration => {
        const {init} = declaration;
        walkExpression(context, init);
    })
};

const parse = function (context, source) {
    const ast = esprima.parse(source, {range: true});
    const body = ast.body;
    walkStatements(context, body);
    return ast;
};

module.exports = parse;
