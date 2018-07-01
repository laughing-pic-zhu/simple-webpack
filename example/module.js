const CommonjsPlugin = require('../lib/dependencies/CommonjsPlugin');
const Compiler = require('../lib/Compiler');
const WebpackOptionsApply = require('../lib/WebpackOptionsApply');
const NodeEnviromentPlugin = require('../lib/node/NodeEnviromentPlugin');

const compiler = new Compiler({
    context: __dirname,
});

compiler.apply(new NodeEnviromentPlugin());
new WebpackOptionsApply().process({}, compiler);
compiler.apply(new CommonjsPlugin());


compiler.compile(__dirname, './a', 'main', function () {
    console.log('compile success');
});
