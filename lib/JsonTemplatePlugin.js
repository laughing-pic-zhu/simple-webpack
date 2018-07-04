const JsonMainTemplate = require('./JsonMainTemplate');

function JsonTemplatePlugin() {

}

JsonTemplatePlugin.prototype.apply = function (compiler) {
    compiler.mainTemplate = new JsonMainTemplate();
    compiler.plugin('compilation', function (compilation) {

    })
};

module.exports = JsonTemplatePlugin;
