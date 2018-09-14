const ModuleFilenameHelpers = require('./ModuleFilenameHelpers');
const RawSource = require('./RawSource');

class EvalDevtoolModuleTemplatePlugin {
    constructor(sourceUrlComment, moduleFilenameTemplate) {
        this.sourceUrlComment = sourceUrlComment || "\n//# sourceURL=[url]";
        this.moduleFilenameTemplate = moduleFilenameTemplate || 'webpack:///[resourcePath]';
    }

    apply(moduleTemplate) {
        const {sourceUrlComment, moduleFilenameTemplate} = this;
        moduleTemplate.plugin('module', function (source, module, chunk) {
            const filename = module.request.replace(this.context, '.');
            const content = source.source();
            const footer = '\n' + ModuleFilenameHelpers.createFooter(module, module.rawRequest) + sourceUrlComment.replace('[url]', moduleFilenameTemplate).replace('[resourcePath]', filename);
            const raw = new RawSource('eval(' + JSON.stringify(content + footer) + ')');
            return raw;
        })
    }
}

module.exports = EvalDevtoolModuleTemplatePlugin;
