const ConstDependency = require('./ConstDependency');
const NullFactory = require('../NullFactory');

class ConstPlugin {
    apply(compiler) {
        compiler.parser.plugin("statement if", function (statement) {
                const param = this.evaluateExpression(statement.test);
                if(param&&param.asBool){
                    const bool = param.asBool();
                    if (typeof bool === "boolean") {
                        const dep = new ConstDependency(bool, param.range);
                        this.state.current.addDependency(dep);
                    }
                }

            }
        )
        compiler.plugin("compilation", (compilation, params) => {
            const {nullFactory} = params;
            compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());
            compilation.dependencyFactories.set(ConstDependency, nullFactory);

        })
    }
}

module.exports = ConstPlugin;
