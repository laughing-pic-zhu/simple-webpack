const Template = require('./Template');
const RawSource = require('./RawSource');
const ParserHelpers = require('./ParserHelpers');

class HotModuleReplacementPlugin {
    constructor(options) {
        this.options = options || {};
        this.requestTimeout = this.options.requestTimeout || 10000;
    }

    apply(compiler) {
        const requestTimeout = this.requestTimeout;
        const hotUpdateMainFilename = compiler.outputOptions.hotUpdateMainFilename;
        const hotUpdateChunkFilename = compiler.outputOptions.hotUpdateChunkFilename;

        compiler.parser.plugin('evaluate Identifier module.hot', function (expression) {
            console.log(1)
            return ParserHelpers.evaluateToIdentifier("module.hot",true)(expression);
            // return this.
        });

        compiler.plugin('compilation', (compilation, params) => {
            const hotUpdateChunkTemplate = compilation.hotUpdateChunkTemplate;
            compilation.plugin('record', function (compilation, records) {
                if (records.hash === this.hash) return;
                records.hash = this.hash;
                records.moduleHashs = {};
                compilation.modules.forEach(module => {
                    const identifier = module.identifier();
                    const hash = require('crypto').createHash('md5');
                    module.updateHash(hash);
                    records.moduleHashs[identifier] = hash.digest('hex');
                });
                records.chunkHashs = {};
                compilation.chunks.forEach(chunk => {
                    records.chunkHashs[chunk.id] = chunk.hash;
                })
            });

            compilation.plugin('additional-chunk-assets', function () {
                const records = this.records;
                if (!records.moduleHashs || !records.chunkHashs) return;
                const hotUpdateContent = {
                    h: this.hash,
                    c: {}
                }
                this.modules.forEach(module => {
                    const identifier = module.identifier();
                    const hash = require('crypto').createHash('md5');
                    module.updateHash(hash);
                    module.hotUpdate = records.moduleHashs[identifier] !== hash.digest('hex');
                });

                Object.keys(records.moduleHashs).forEach(chunkId => {
                    const currentChunk = this.chunks.find(chunk => chunkId === chunk.id)
                    if (currentChunk) {
                        const hotModules = this.modules.filter(module => module.hotUpdate);
                        const filename = this.getPath(hotUpdateChunkFilename, {
                            hash: records.hash,
                            chunk: currentChunk
                        });
                        const source = hotUpdateChunkTemplate.render(chunkId, hotModules, this.hash, this.moduleTemplate);
                        this.assets[filename] = source;
                        hotUpdateContent.c[currentChunk.id] = true;
                    } else {
                        hotUpdateContent.c = {
                            [chunkId]: false
                        }
                    }

                });
                const filename = this.getPath(hotUpdateMainFilename, {hash: this.hash});
                const source = new RawSource(JSON.stringify(hotUpdateContent));
                this.assets[filename] = source;
            });

            compilation.mainTemplate.plugin('bootstrap', function (source, chunk, hash) {
                source = this.applyPluginsWaterfall("hot-bootstrap", source, chunk, hash);
                return this.asString([
                    source,
                    "",
                    hotInitCode
                        .replace(/\$require\$/g, this.requireFn)
                        .replace(/\$hash\$/g, JSON.stringify(hash))
                        .replace(/\$requestTimeout\$/g, requestTimeout)
                ])
            });

            compilation.mainTemplate.plugin('module-require', (_, chunk, hash, varModuleId) => {
                return `hotCreateRequire(${varModuleId})`
            });


            compilation.mainTemplate.plugin('module-obj', function (source, chunk, hash, varModuleId) {
                return this.asString([
                    `${source}`,
                    `hot: hotCreateModule(${varModuleId}),`,
                    "parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),",
                    "children: []"
                ])
            })

            compilation.mainTemplate.plugin('require-extensions', function (source) {
                const buf = [source];
                buf.push("// __webpack_hash__");
                buf.push(`${this.requireFn}.h = function() { return hotCurrentHash; };`)
                return this.asString(buf);
            });

            compilation.mainTemplate.plugin('current-hash', () => {
                return "hotCurrentHash";
            });
        })
    }
}

const hotInitCode = Template.getFunctionContent(require('./HotModuleReplacement.runtime'));

module.exports = HotModuleReplacementPlugin;
