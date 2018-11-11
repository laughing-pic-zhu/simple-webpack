const Template = require('./Template')
const Chunk = require('./Chunk');

class HotUpdateChunkTemplate extends Template {
    render(id, modules, hash, moduleTemplate, dependencyTemplates) {
        const hotChunk = new Chunk();
        hotChunk.id = id;
        hotChunk.setModules(modules);
        const modulesSource = this.renderChunk(hotChunk, moduleTemplate);
        const source = this.applyPluginsWaterfall('render', modulesSource, modules, id)
        return source
    }
}

module.exports = HotUpdateChunkTemplate;
