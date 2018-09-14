const ModuleFilenameHelpers = require('./ModuleFilenameHelpers');

class EvalSourceMapDevtoolModuleTemplatePlugin {
    constructor(options) {
        this.moduleFilenameTemplate = options.moduleFilenameTemplate || '\n//# sourceURL=webpack-internal:///[resourcePath]';
        this.sourceMapComment = options.append || "//# sourceURL=[module]\n//# sourceMappingURL=[url]";
    }

    apply(moduleTemplate) {
        const {sourceMapComment, moduleFilenameTemplate} = this;
        moduleTemplate.plugin('module', (source, module, chunk) => {
            if (source.__EvalSourceMapDevToolData) {
                return source.__EvalSourceMapDevToolData;
            }
            const sourceMap = source.sourceAndMap();
            const {code, map} = sourceMap;
            const footer = sourceMapComment.replace('[url]', 'data:application/json;charset=utf-8;base64,' + new Buffer(JSON.stringify(map), 'utf-8').toString('base64')) + moduleFilenameTemplate.replace('[resourcePath]', module.id);
            return 'eval(' + JSON.stringify(code + footer) + ')';
        })
    }
}

module.exports = EvalSourceMapDevtoolModuleTemplatePlugin;
