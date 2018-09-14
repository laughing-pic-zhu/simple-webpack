const JsonTemplatePlugin = require('./JsonTemplatePlugin');
const CommonjsPlugin = require('./dependencies/CommonJsPlugin');
const NodeEnviromentPlugin = require('./node/NodeEnviromentPlugin');
const EntryOptionPlugin = require('./EntryOptionPlugin');
const ResolverFactory = require("enhanced-resolve").ResolverFactory;
const TemplatedPathPlugin = require('./TemplatedPathPlugin');
const EvalDevtoolModulePlugin = require('./EvalDevtoolModulePlugin');
const EvalSourceMapDevToolPlugin = require('./EvalSourceMapDevToolPlugin');
const SourceMapDevToolPlugin = require('./SourceMapDevToolPlugin');


class WebpackOptionsApply {
    constructor(props) {

    }

    process(options, compiler) {
        const {context, entry, plugins, devtool} = options;
        if (Array.isArray(plugins)) {
            compiler.apply.apply(compiler, plugins);
        }
        compiler.context = context;
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

        let evalWarpped;
        let legacy;
        let modern;
        let noSource;
        let hidden;
        let comment;
        let inline;
        const moduleFilenameTemplate = options.output.devtoolModuleFilenameTemplate;
        if (devtool.indexOf('source-map') > -1 || devtool.indexOf('sourcemap') > -1) {
            evalWarpped = devtool.indexOf('eval') >= 0;
            legacy = devtool.indexOf('@') >= 0;
            modern = devtool.indexOf('#') >= 0;
            const cheap = options.devtool.indexOf("cheap") >= 0;
            noSource = devtool.indexOf('nosources');
            hidden = devtool.indexOf('hidden') >= 0;
            inline = devtool.indexOf('inline') >= 0;
            comment = legacy && modern ? '\n/*\n//@ sourceMappingURL=[url]\n//# sourceMappingURL=[url]\n*/' : legacy ?
                '\n/*\n//@ sourceMappingURL=[url]\n*/' : modern ? '\n//# sourceMappingURL=[url]' : null;
            let Plugin;
            if (evalWarpped) {
                Plugin = EvalSourceMapDevToolPlugin;
            } else {
                Plugin = SourceMapDevToolPlugin;
            }

            compiler.apply(new Plugin({
                append: hidden ? false : comment,
                columns: cheap ? false : true,
                noSource,
                filename: inline ? null : options.output.sourceMapFilename,
                moduleFilenameTemplate,
                fallbackModuleFilenameTemplate: options.output.devtoolFallbackModuleFilenameTemplate,
            }));

        } else if (devtool.indexOf('eval') > -1) {
            comment = legacy && modern ? '\n//@ sourceURL=[url]\n//# sourceURL=[url]' : legacy ? '\n//@ sourceURL=[url]'
                : modern ? '\n//# sourceURL=[url]' : null;
            compiler.apply(new EvalDevtoolModulePlugin(comment, moduleFilenameTemplate));
        }

        compiler.apply(new EntryOptionPlugin());
        compiler.apply(new TemplatedPathPlugin());
        compiler.applyPlugins('entry-option', options.context, entry);
    }
}

module.exports = WebpackOptionsApply;
