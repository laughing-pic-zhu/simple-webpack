var Resolver = require("enhanced-resolve/lib/Resolver");
var NodeJsInputFileSystem = require("enhanced-resolve/lib/NodeJsInputFileSystem");
var CachedInputFileSystem = require("enhanced-resolve/lib/CachedInputFileSystem");
var ModulesInDirectoriesPlugin = require("enhanced-resolve/lib/ModulesInDirectoriesPlugin");
var ModuleAsFilePlugin = require("enhanced-resolve/lib/ModuleAsFilePlugin");
var ModuleAsDirectoryPlugin = require("enhanced-resolve/lib/ModuleAsDirectoryPlugin");
var ModuleAliasPlugin = require("enhanced-resolve/lib/ModuleAliasPlugin");
var DirectoryDefaultFilePlugin = require("enhanced-resolve/lib/DirectoryDefaultFilePlugin");
var DirectoryDescriptionFilePlugin = require("enhanced-resolve/lib/DirectoryDescriptionFilePlugin");
var FileAppendPlugin = require("enhanced-resolve/lib/FileAppendPlugin");

const resolver = new Resolver(null);
resolver.fileSystem = new CachedInputFileSystem(new NodeJsInputFileSystem(), 6000);

resolver.apply(
    new ModuleAliasPlugin({}),
    new ModulesInDirectoriesPlugin("module", ['node_modules']),
    new ModuleAsFilePlugin("module"),
    new ModuleAsDirectoryPlugin("module"),
    new DirectoryDescriptionFilePlugin("package.json", ["webpack", "browserify", "web", ["jam", "main"], "main"]),
    new DirectoryDefaultFilePlugin(["index"]),
    new FileAppendPlugin(['.js'])
);

resolver.resolve(__dirname, 'c', function (e,result) {
    console.log(result)
})
