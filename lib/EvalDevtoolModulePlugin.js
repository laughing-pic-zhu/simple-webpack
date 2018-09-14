const EvalDevtoolModuleTemplatePlugin = require('./EvalDevtoolModuleTemplatePlugin');

class EvalDevtoolModulePlugin {
    constructor(sourceUrlComment, moduleFilenameTemplate) {
        this.sourceUrlComment = sourceUrlComment;
        this.moduleFilenameTemplate = moduleFilenameTemplate;
    }

    apply(compiler) {
        compiler.plugin('compilation', compilation => {
            compilation.moduleTemplate.apply(new EvalDevtoolModuleTemplatePlugin(this.sourceUrlComment, this.moduleFilenameTemplate))
        })
    }
}

module.exports = EvalDevtoolModulePlugin;
