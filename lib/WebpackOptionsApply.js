const NodeJsInputFileSystem = require("enhanced-resolve/lib/NodeJsInputFileSystem");
const CachedInputFileSystem = require("enhanced-resolve/lib/CachedInputFileSystem");
const ModulesInDirectoriesPlugin = require("enhanced-resolve/lib/ModulesInDirectoriesPlugin");
const ModulesInRootPlugin = require("enhanced-resolve/lib/ModulesInRootPlugin");
const ModuleTemplatesPlugin = require("enhanced-resolve/lib/ModuleTemplatesPlugin");
const ModuleAsFilePlugin = require("enhanced-resolve/lib/ModuleAsFilePlugin");
const ModuleAsDirectoryPlugin = require("enhanced-resolve/lib/ModuleAsDirectoryPlugin");
const ModuleAliasPlugin = require("enhanced-resolve/lib/ModuleAliasPlugin");
const DirectoryDefaultFilePlugin = require("enhanced-resolve/lib/DirectoryDefaultFilePlugin");
const DirectoryDescriptionFilePlugin = require("enhanced-resolve/lib/DirectoryDescriptionFilePlugin");
const FileAppendPlugin = require("enhanced-resolve/lib/FileAppendPlugin");
const DirectoryResultPlugin = require("enhanced-resolve/lib/DirectoryResultPlugin");
const JsonTemplatePlugin = require('./JsonTemplatePlugin');
const CommonjsPlugin = require('./dependencies/CommonJsPlugin');
const NodeEnviromentPlugin = require('./node/NodeEnviromentPlugin');
const SingleEntryPlugin = require('./dependencies/SingleEntryPlugin');
const path = require('path');

class WebpackOptionsApply {
    constructor(props) {

    }

    process(options, compiler) {
        const {context} = options;
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
        compiler.resolver.normal.apply(
            new ModuleAliasPlugin({}),
            this.makeRootPlugin("module", undefined),
            new ModulesInDirectoriesPlugin("module", ['node_modules']),
            this.makeRootPlugin("module", undefined),
            new ModuleAsFilePlugin("module"),
            new ModuleAsDirectoryPlugin("module"),
            new DirectoryDescriptionFilePlugin("package.json", ["webpack", "browserify", "web", ["jam", "main"], "main"]),
            new DirectoryDefaultFilePlugin(["index"]),
            new FileAppendPlugin(['', '.js'])
        );

        compiler.resolver.loader.apply(
            new ModuleAliasPlugin({}),
            this.makeRootPlugin("module", undefined),
            new ModulesInDirectoriesPlugin("module", ['node_modules']),
            this.makeRootPlugin("module", undefined),
            new ModuleAsFilePlugin("module"),
            new ModuleAsDirectoryPlugin("module"),
            new DirectoryDescriptionFilePlugin("package.json", ["webpack", "browserify", "web", ["jam", "main"], "main"]),
            new DirectoryDefaultFilePlugin(["index"]),
            new FileAppendPlugin(['', '.js'])
        );


        let {entry} = options;
        const entryObj = this.processEntry(entry);
        if (entryObj.length === 1) {
            const entryName = entryObj[0].entry;
            const name = entryObj[0].name;
            compiler.apply(new SingleEntryPlugin({context, name, entry: entryName}));
        }
    }

    processEntry(entry) {
        if (typeof entry === 'object') {
            const array = [];
            Object.keys(entry).forEach(key => {
                array.push({
                    name: key,
                    entry: entry[key]
                });
            })
            return array;
        } else if (typeof entry === 'string') {
            return {
                name: 'main',
                entry
            }
        }
    }

    makeRootPlugin(name, root) {
        if (typeof root === "string")
            return new ModulesInRootPlugin(name, root);
        else if (Array.isArray(root)) {
            return function () {
                root.forEach(function (root) {
                    this.apply(new ModulesInRootPlugin(name, root));
                }, this);
            }
        }
        return function () {
        };
    }
}

module.exports = WebpackOptionsApply;
