const JsonTemplatePlugin = require('./JsonTemplatePlugin');
const CommonjsPlugin = require('./dependencies/CommonJsPlugin');
const NodeEnviromentPlugin = require('./node/NodeEnviromentPlugin');
const EntryOptionPlugin = require('./EntryOptionPlugin');
const ResolverFactory = require("enhanced-resolve").ResolverFactory;

class WebpackOptionsApply {
    constructor(props) {

    }

    process(options, compiler) {
        const {context, entry, plugins} = options;
        if (Array.isArray(plugins)) {
            compiler.apply.apply(compiler, plugins);
        }
        compiler.outputPath = options.output.path;
        compiler.outputOptions = options.output;
        if (options && options.output) {
            compiler.outputOptions.fileName = options.output.filename.replace('[name]', '');
        }
        compiler.rules = options.module.rules;
        compiler.apply(new NodeEnviromentPlugin());
        compiler.apply(new CommonjsPlugin());
        compiler.apply(
            new JsonTemplatePlugin()
        );

        compiler.resolver.normal = ResolverFactory.createResolver(Object.assign({
            fileSystem: compiler.inputFileSystem
        }, options.resolve));
        compiler.resolver.context = ResolverFactory.createResolver(Object.assign({
            fileSystem: compiler.inputFileSystem,
            resolveToContext: true
        }, options.resolve));
        compiler.resolver.loader = ResolverFactory.createResolver(Object.assign({
            fileSystem: compiler.inputFileSystem
        }, options.resolveLoader));


        compiler.apply(new EntryOptionPlugin());
        compiler.applyPlugins('entry-option',options.context,entry);
    }
}

module.exports = WebpackOptionsApply;
