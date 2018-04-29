const esprima = require('esprima');

const walkStatements = function (context, statements) {
    statements.forEach(statement => {
        walkStatement(context, statement);
    });
};

const walkStatement = function (context, statement) {
    const {declarations, type, callee, arguments} = statement;
    switch (type) {
        case 'VariableDeclaration':
            if (declarations) {
                walkVariableDeclaration(context, declarations);
            }
            break;
        case 'CallExpression':
            if (callee && callee.type === 'Identifier' && arguments && arguments.length >= 1) {
                const {name, range: rangeRequires} = callee;
                context.rangeRequires.push(rangeRequires);
                console.log(rangeRequires)
                if (name === 'require') {
                    arguments.forEach(argument => {
                        const {value, range} = argument;
                        context.requires.push({
                            name: value,
                            range,
                        })
                    });
                }
            }
            break;
    }
};

const walkVariableDeclaration = function (context, declarations) {
    declarations.forEach(declaration => {
        const {init} = declaration;
        walkStatement(context, init);
    })
};

const parse = function (context, source) {
    const ast = esprima.parse(source, {range: true});
    const body = ast.body;
    walkStatements(context, body);
    return ast;
};

module.exports = parse;
