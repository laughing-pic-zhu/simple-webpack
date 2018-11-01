const JsonpMainTemplatePlugin = require('./JsonpMainTemplatePlugin');

class JsonTemplatePlugin {
    apply(compiler) {
        compiler.plugin('this-compilation', (compilation) => {
            compilation.mainTemplate.apply(new JsonpMainTemplatePlugin())
        })
    };
}


module.exports = JsonTemplatePlugin;
