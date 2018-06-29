const CommonjsPlugin = require('../lib/dependencies/CommonjsPlugin');
const Compiler = require('../lib/Compiler');
const WebpackOptionsApply = require('../lib/WebpackOptionsApply');
const NodeEnviromentPlugin = require('../lib/NodeEnviromentPlugin');

const compiler = new Compiler({
    context: __dirname,
});

compiler.abc = 2;

compiler.apply(new NodeEnviromentPlugin());
new WebpackOptionsApply().process({}, compiler);
compiler.apply(new CommonjsPlugin());

compiler.compile('./b');
