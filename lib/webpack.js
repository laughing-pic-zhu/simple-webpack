const Compiler = require('../lib/Compiler');
const WebpackOptionsApply = require('../lib/WebpackOptionsApply');
const WebpackOptionsDefaulter = require('../lib/WebpackOptionsDefaulter');

function exec(options) {
    const compiler = new Compiler();
    options = new WebpackOptionsDefaulter().process(options);
    new WebpackOptionsApply().process(options, compiler);
    compiler.run(function () {
        console.log('compile success');
    });
}

module.exports = exec;
