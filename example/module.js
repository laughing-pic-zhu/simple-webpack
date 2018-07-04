const CommonjsPlugin = require('../lib/dependencies/CommonjsPlugin');
const Compiler = require('../lib/Compiler');
const WebpackOptionsApply = require('../lib/WebpackOptionsApply');


const compiler = new Compiler({
    context: __dirname,
});

new WebpackOptionsApply().process({
    output: {
        path: 'output.js'
    }
}, compiler);


compiler.compile(__dirname, './a', 'main', function () {
    console.log('compile success');
});
