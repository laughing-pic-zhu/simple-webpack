var NodeJsInputFileSystem = require("enhanced-resolve/lib/NodeJsInputFileSystem");
var CachedInputFileSystem = require("enhanced-resolve/lib/CachedInputFileSystem");
var ModulesInDirectoriesPlugin = require("enhanced-resolve/lib/ModulesInDirectoriesPlugin");
var ModulesInRootPlugin = require("enhanced-resolve/lib/ModulesInRootPlugin");
var ModuleTemplatesPlugin = require("enhanced-resolve/lib/ModuleTemplatesPlugin");
var ModuleAsFilePlugin = require("enhanced-resolve/lib/ModuleAsFilePlugin");
var ModuleAsDirectoryPlugin = require("enhanced-resolve/lib/ModuleAsDirectoryPlugin");
var ModuleAliasPlugin = require("enhanced-resolve/lib/ModuleAliasPlugin");
var DirectoryDefaultFilePlugin = require("enhanced-resolve/lib/DirectoryDefaultFilePlugin");
var DirectoryDescriptionFilePlugin = require("enhanced-resolve/lib/DirectoryDescriptionFilePlugin");
var FileAppendPlugin = require("enhanced-resolve/lib/FileAppendPlugin");
var DirectoryResultPlugin = require("enhanced-resolve/lib/DirectoryResultPlugin");

class WebpackOptionsApply {
    constructor(props) {

    }

    process(options, compiler) {
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
