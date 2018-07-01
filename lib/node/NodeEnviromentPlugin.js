const NodeJsInputFileSystem = require("enhanced-resolve/lib/NodeJsInputFileSystem");
const CachedInputFileSystem = require("enhanced-resolve/lib/CachedInputFileSystem");


function NodeEnviromentPlugin() {

}

NodeEnviromentPlugin.prototype.apply = function (compiler) {
    compiler.inputFileSystem = new NodeJsInputFileSystem();
    compiler.inputFileSystem = new CachedInputFileSystem(compiler.inputFileSystem, 6000);
    compiler.resolver.normal.fileSystem = compiler.inputFileSystem;
    compiler.resolver.context.fileSystem = compiler.inputFileSystem;
    compiler.resolver.loader.fileSystem = compiler.inputFileSystem;
};


module.exports = NodeEnviromentPlugin;
