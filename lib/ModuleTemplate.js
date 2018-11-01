const Template = require('./Template');

class ModuleTemplate extends Template {
    constructor(options, context) {
        super();
        this.options = options;
        this.context = context;
    }

    render(module, chunk) {
        const source = module.source();
        return this.applyPluginsWaterfall('module', source, module, chunk);
    }
}

module.exports = ModuleTemplate;