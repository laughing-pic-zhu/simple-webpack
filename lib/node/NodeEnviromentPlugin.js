const NodeJsInputFileSystem = require("enhanced-resolve/lib/NodeJsInputFileSystem");
const CachedInputFileSystem = require("enhanced-resolve/lib/CachedInputFileSystem");
const NodeOutputFileSystem = require('./NodeOutputFileSystem');
const NodeWatchFileSystem = require('./NodeWatchFileSystem');

function NodeEnviromentPlugin() {

}

NodeEnviromentPlugin.prototype.apply = function (compiler) {
    compiler.inputFileSystem = new CachedInputFileSystem(new NodeJsInputFileSystem(), 60000);
    compiler.outputFileSystem = new NodeOutputFileSystem();
    compiler.watchFileSystem=new NodeWatchFileSystem(compiler.inputFileSystem);
};


module.exports = NodeEnviromentPlugin;
