const Template = require("./Template");

class JsonpMainTemplatePlugin {
    apply(mainTemplate) {
        mainTemplate.plugin('bootstrap', function (source, chunk, hash) {
            const jsonpFunction = 'webpackJsonp';
            // this.outputOptions.jsonpFunction;
            if (chunk.chunks.length > 1) {
                return this.asString([
                    source,
                    '// install a JSONP callback for chunk loading',
                    `var parentJsonpFunction = window[${JSON.stringify(jsonpFunction)}];`,
                    `window[${JSON.stringify(jsonpFunction)}] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {`,
                    this.indent([
                        '// add "moreModules" to the modules object,',
                        '// then flag all "chunkIds" as loaded and fire callback',
                        'var moduleId, chunkId, i = 0, resolves = [], result;',
                        'for(;i < chunkIds.length; i++) {',
                        this.indent([
                            'chunkId = chunkIds[i];',
                            'resolves.push(installedChunks[chunkId][0]);'
                        ]),
                        '}',
                        'installedChunks[chunkId] = 0;',
                        'for(moduleId in moreModules) {',
                        this.indent([
                            'if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {',
                            this.indent('modules[moduleId] = moreModules[moduleId];'),
                            '}',
                        ]),
                        '}',
                        'if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);',
                        'while(resolves.length) {',
                        this.indent('resolves.shift()();'),
                        '}',
                    ]),
                    '};',
                ]);
            }
            return source
        });

        mainTemplate.plugin("local-vars", function (source, chunk,hash) {
            if (chunk.chunks.length > 1) {
                return this.asString([
                    source,
                    "// objects to store loaded and loading chunks",
                    "var installedChunks = {",
                    this.indent(`${chunk.id}: 0\n`,),
                    "};"
                ]);
            }
            return source;
        });

        mainTemplate.plugin("hot-bootstrap", function (source, chunk, hash = '') {
            const {hotUpdateChunkFilename, hotUpdateMainFilename, hotUpdateFunction} = this.outputOptions;
            const currentHotUpdateChunkFilename = this.applyPluginsWaterfall('asset-path', hotUpdateChunkFilename, {
                hash: `"+${this.renderCurrentHashCode(hash)}+"`,
                chunk: {
                    id: "\"+chunkId+\""
                }
            });
            const currentHotUpdateMainFilename = this.applyPluginsWaterfall('asset-path', hotUpdateMainFilename, {
                hash: `"+${this.renderCurrentHashCode(hash)}+"`,
            });
            const runtimeSource = Template.getFunctionContent(require('./JsonpMainTemplate.runtime'))
                .replace(/\/\/\$semicolon/g, ';')
                .replace(/\$require\$/g, this.requireFn)
                .replace(/\$hotChunkFilename\$/g, currentHotUpdateChunkFilename)
                .replace(/\$hotMainFilename\$/, currentHotUpdateMainFilename);
            return `${source}   
function hotDisposeChunk(chunkId) {
    delete installedChunks[chunkId];
}
var parentHotUpdateCallback = window[${JSON.stringify(hotUpdateFunction)}];
window[${JSON.stringify(hotUpdateFunction)}] = \n${runtimeSource}`
        })
    }
}

module.exports = JsonpMainTemplatePlugin
