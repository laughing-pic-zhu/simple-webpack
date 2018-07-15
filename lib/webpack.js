const Compiler = require('../lib/Compiler');
const WebpackOptionsApply = require('../lib/WebpackOptionsApply');
const WebpackOptionsDefaulter = require('../lib/WebpackOptionsDefaulter');

function exec(options) {
    const compiler = new Compiler();
    const {module, context} = options;
    options = new WebpackOptionsDefaulter().process(options);

    new WebpackOptionsApply().process(options, compiler);
    const entry = options.entry;
    Object.keys(entry).forEach(name => {
        compiler.compile(context, entry[name], name, function () {
            console.log('compile success');
        });
    })
}

module.exports = exec;
