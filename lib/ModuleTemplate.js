const Template = require('./Template');

class ModuleTemplate extends Template {
    constructor(options, context) {
        super();
        this.options = options;
        this.context = context;
    }

    render(module, chunk,dependencyTemplates) {
        const source = module.source(dependencyTemplates);
        return this.applyPluginsWaterfall('module', source, module, chunk);
    }
}

module.exports = ModuleTemplate;
