const ConcatSource = require('./ConcatSource');
const RawSource = require('./RawSource');
const ModuleFilenameHelpers = require('./ModuleFilenameHelpers');

class SourceMapDevToolPlugin {
    constructor(options) {
        options = options || {};
        const {filename, append, moduleFilenameTemplate = "webpack:///[resourcePath]", fallbackModuleFilenameTemplate = "webpack:///[resourcePath]?[hash]"} = options;
        this.sourceMapFilename = filename;
        this.sourceMappingURLComment = append === false ? false : append || "\n//# sourceMappingURL=[url]";
        this.moduleFilenameTemplate = moduleFilenameTemplate;
        this.fallbackModuleFilenameTemplate = fallbackModuleFilenameTemplate;
        this.options = options;
    }

    apply(compiler) {
        const {sourceMapFilename, sourceMappingURLComment, moduleFilenameTemplate, fallbackModuleFilenameTemplate, options} = this;
        compiler.plugin('compilation', compilation => {
            const context = compiler.context;
            compilation.plugin('after-optimize-chunk-assets', function (chunks) {
                chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        const res = compilation.assets[file].sourceAndMap();
                        const {map} = res;
                        const modules = [];
                        map.sources = map.sources.map(name => {
                            const module = compilation.findModule(name);
                            if (module) {
                                modules.push(module);
                                name = name.replace(context, '.')
                            } else {
                                modules.push(name);
                            }
                            return moduleFilenameTemplate.replace('[resourcePath]', name);
                        });

                        Object.keys(map.sourcesContent).forEach((key, i) => {
                            map.sourcesContent[key] = map.sourcesContent[key] + `\n\n\n${ModuleFilenameHelpers.createFooter(modules[i], modules[i].rawRequest)}`;
                        });

                        map.sourceRoot = '';
                        map.file = file;
                        const concat = new ConcatSource();
                        if (sourceMapFilename) {
                            const filename = compilation.getPath(sourceMapFilename, {chunk,file});
                            concat.add(compilation.assets[file]);
                            if(sourceMappingURLComment){
                                concat.add(new RawSource(sourceMappingURLComment.replace('[url]', filename)));
                            }
                            compilation.assets[file] = concat;
                            compilation.assets[filename] = new RawSource(JSON.stringify(map));
                        } else {
                            concat.add(compilation.assets[file]);
                            concat.add(new RawSource(sourceMappingURLComment.replace('[url]', `data:application/json;charset=utf-8;base64,${new Buffer(JSON.stringify(map), 'utf-8').toString('base64')}`)));
                            compilation.assets[file] = concat;
                        }
                    })

                })
            })
        })
    }
}

module.exports = SourceMapDevToolPlugin;
