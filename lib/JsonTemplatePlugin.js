const JsonpMainTemplatePlugin = require('./JsonpMainTemplatePlugin');
const JsonpHotUpdateChunkTemplatePlugin = require('./JsonpHotUpdateChunkTemplatePlugin');

class JsonTemplatePlugin {
    apply(compiler) {
        compiler.plugin('this-compilation', (compilation) => {
            compilation.mainTemplate.apply(new JsonpMainTemplatePlugin())
            compilation.hotUpdateChunkTemplate.apply(new JsonpHotUpdateChunkTemplatePlugin(compilation.outputOptions))
        })
    };
}


module.exports = JsonTemplatePlugin;
