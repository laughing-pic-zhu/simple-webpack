const ConcatSource = require('./ConcatSource');

class JsonpHotUpdateChunkTemplatePlugin {
    apply(hotUpdateChunkTemplate) {
        hotUpdateChunkTemplate.plugin('render', function (modulesSource, modules, id) {
            const concatSource = new ConcatSource();
            concatSource.add(`${this.outputOptions.hotUpdateFunction}(${id},`);
            concatSource.add(modulesSource);
            concatSource.add(')');
            return source;
        })
    }
}

module.exports = JsonpHotUpdateChunkTemplatePlugin;
