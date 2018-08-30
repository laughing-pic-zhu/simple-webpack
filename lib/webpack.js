const Compiler = require('../lib/Compiler');
const WebpackOptionsApply = require('../lib/WebpackOptionsApply');
const WebpackOptionsDefaulter = require('../lib/WebpackOptionsDefaulter');

function webpack(options) {
    const compiler = new Compiler();
    options = new WebpackOptionsDefaulter().process(options);
    new WebpackOptionsApply().process(options, compiler);
    compiler.run(function () {
        console.log('compile success');
    });
}

exports = module.exports = webpack;

function exportPlugins(obj, mapping) {
    Object.keys(mapping).forEach(key => {
        Object.defineProperty(obj, key, {
            configurable: false,
            enumerable: true,
            get: mapping[key],
        })
    })
}

exportPlugins(exports, {
    "SourceMapDevToolPlugin": () => require("./SourceMapDevToolPlugin")
});


