const Compiler = require('./Compiler');
const WebpackOptionsApply = require('./WebpackOptionsApply');
const WebpackOptionsDefaulter = require('./WebpackOptionsDefaulter');
const validateSchema = require('./validateSchema');

function webpack(options) {
    const compiler = new Compiler();
    options = new WebpackOptionsDefaulter().process(options);
    new WebpackOptionsApply().process(options, compiler);
    return compiler
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
    "SourceMapDevToolPlugin": () => require("./SourceMapDevToolPlugin"),
    "HotModuleReplacementPlugin": () => require("./HotModuleReplacementPlugin")
});

webpack.validateSchema = validateSchema;
