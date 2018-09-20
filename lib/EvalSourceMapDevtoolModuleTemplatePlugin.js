const ModuleFilenameHelpers = require('./ModuleFilenameHelpers');

class EvalSourceMapDevtoolModuleTemplatePlugin {
    constructor(options) {
        this.moduleFilenameTemplate = options.moduleFilenameTemplate || '\n//# sourceURL=webpack-internal:///[resourcePath]';
        this.sourceMapComment = options.append || "//# sourceURL=[module]\n//# sourceMappingURL=[url]";
        this.options=options;
    }

    apply(moduleTemplate) {
        const {sourceMapComment, moduleFilenameTemplate,options} = this;
        moduleTemplate.plugin('module', (source, module, chunk) => {
            if (source.__EvalSourceMapDevToolData) {
                return source.__EvalSourceMapDevToolData;
            }
            const sourceMap = source.sourceAndMap(options);
            const {code, map} = sourceMap;
            const footer = sourceMapComment.replace('[url]', 'data:application/json;charset=utf-8;base64,' + new Buffer(JSON.stringify(map), 'utf-8').toString('base64')) + moduleFilenameTemplate.replace('[resourcePath]', module.id);
            return 'eval(' + JSON.stringify(code + footer) + ')';
        })
    }
}

module.exports = EvalSourceMapDevtoolModuleTemplatePlugin;
