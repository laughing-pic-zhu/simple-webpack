const Compiler = require('../lib/Compiler');
const WebpackOptionsApply = require('../lib/WebpackOptionsApply');
const WebpackOptionsDefaulter = require('../lib/WebpackOptionsDefaulter');

function webpack(options) {
    const compiler = new Compiler();
    options = new WebpackOptionsDefaulter().process(options);
    new WebpackOptionsApply().process(options, compiler);

    if (options.watch) {
        compiler.watch();
        console.log("\nWebpack is watching the files…\n");
    } else {
        compiler.run(function () {
            console.log('compile success');
        });
    }

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


