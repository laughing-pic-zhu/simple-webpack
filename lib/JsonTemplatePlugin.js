const JsonMainTemplate = require('./JsonMainTemplate');
const JsonpChunkTemplate = require('./JsonpChunkTemplate');

function JsonTemplatePlugin() {

}

JsonTemplatePlugin.prototype.apply = function (compiler) {
    compiler.mainTemplate = new JsonMainTemplate();
    compiler.chunkTemplate = new JsonpChunkTemplate();
    compiler.plugin('compilation', function (compilation) {

    })
};

module.exports = JsonTemplatePlugin;
