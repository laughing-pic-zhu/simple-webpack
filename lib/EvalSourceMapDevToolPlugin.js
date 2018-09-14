const EvalSourceMapDevtoolModuleTemplatePlugin = require('./EvalSourceMapDevtoolModuleTemplatePlugin');

class EvalSourceMapDevToolPlugin {
    constructor(options) {
        if (typeof options === 'string') {
            options = {
                append: options
            }
        }
        if (!options) {
            options = {};
        }
        this.options = options;
    }

    apply(compiler) {
        compiler.plugin('compilation', compilation => {
            compilation.moduleTemplate.apply(new EvalSourceMapDevtoolModuleTemplatePlugin(this.options));
        });
    }
}

module.exports = EvalSourceMapDevToolPlugin;
