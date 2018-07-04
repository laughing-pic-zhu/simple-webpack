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
const CommonjsPlugin = require('./dependencies/CommonjsPlugin');
const NodeEnviromentPlugin = require('./node/NodeEnviromentPlugin');

class WebpackOptionsApply {
    constructor(props) {

    }

    process(options, compiler) {
        compiler.outputPath = options.output.path;
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
