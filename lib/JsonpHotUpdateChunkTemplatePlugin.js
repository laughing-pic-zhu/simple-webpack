const ConcatSource = require('./ConcatSource');

class JsonpHotUpdateChunkTemplatePlugin {
    constructor(outputOptions){
        this.outputOptions=outputOptions;
    }

    apply(hotUpdateChunkTemplate) {
        hotUpdateChunkTemplate.plugin('render',  (modulesSource, modules, id)=> {
            const concatSource = new ConcatSource();
            concatSource.add(`${this.outputOptions.hotUpdateFunction}(${id},`);
            concatSource.add(modulesSource);
            return concatSource;
        })
    }
}

module.exports = JsonpHotUpdateChunkTemplatePlugin;
