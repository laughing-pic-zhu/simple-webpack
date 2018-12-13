const Template = require('./Template');
const RawSource = require('./RawSource');
const ModuleDependency = require("./dependencies/CommonjsRequireDependency");
const AcceptImportDependency = require("./dependencies/AcceptImportDependency");
const HotAcceptDependency = require('./dependencies/HotAcceptDependency');
const ParserHelpers = require('./ParserHelpers');
const NullFactory = require('./NullFactory');

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
            return ParserHelpers.evaluateToIdentifier("module.hot", true)(expression);
        });

        compiler.parser.plugin('expression __webpack_hash__', ParserHelpers.toConstantDependency("__webpack_require__.h()"));

        compiler.parser.plugin('call module.hot.accept', function (expression) {
            const arg = expression.arguments;
            if (Array.isArray(arg)) {
                const exp = this.evaluateExpression(arg[0]);
                let params;
                const requests = [];
                if (exp.isString()) {
                    params = [exp];
                } else if (exp.isArray()) {
                    params = exp.items;
                }
                params.forEach(param => {
                    const dep = new ModuleDependency({
                        request: param.string,
                        range: param.range
                    });
                    requests.push(param.string);
                    this.state.current.addDependency(dep);
                })

                if (arg.length > 1) {
                    this.applyPluginsBailResult('hot accept callback', arg[1], requests)
                } else {
                    this.applyPluginsBailResult('hot accept without callback', expression, requests)
                }
            }
        });

        compiler.parser.plugin("hot accept callback", function (expr, requests) {
            const dependencies = requests.map(request => {
                const dep = new AcceptImportDependency({request, range: expr.range})
                this.state.current.addDependency(dep);
                return dep;
            })

            const dep = new HotAcceptDependency(expr.range, dependencies, true)
            this.state.current.addDependency(dep);
        });

        compiler.parser.plugin("hot accept without callback", function (expr, requests) {
            const dependencies = requests.map(request => {
                const dep = new AcceptImportDependency({request, range: expr.range})
                this.state.current.addDependency(dep);
                return dep;
            })

            const dep = new HotAcceptDependency(expr.range, dependencies, false)
            this.state.current.addDependency(dep);
        });

        compiler.parser.plugin('call module.hot.decline', function (expression) {
            const arg = expression.arguments;
            if (Array.isArray(arg)) {
                const exp = this.evaluateExpression(arg[0]);
                let params;
                const requests = [];
                if (exp.isString()) {
                    params = [exp];
                } else if (exp.isArray()) {
                    params = exp.items;
                }
                params.forEach(param => {
                    const dep = new ModuleDependency({
                        request: param.string,
                        range: param.range
                    });
                    requests.push(param.string);
                    this.state.current.addDependency(dep);
                })
            }
        })

        compiler.plugin('compilation', (compilation, params) => {
            const {normalModuleFactory} = params;
            compilation.dependencyFactories.set(HotAcceptDependency, new NullFactory());
            compilation.dependencyTemplates.set(HotAcceptDependency, new HotAcceptDependency.Template());
            compilation.dependencyFactories.set(AcceptImportDependency, normalModuleFactory);
            compilation.dependencyTemplates.set(AcceptImportDependency, new AcceptImportDependency.Template());

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

                Object.keys(records.chunkHashs).forEach(chunkId => {
                    const currentChunk = this.chunks.find(chunk => chunkId === chunk.id + '')
                    if (currentChunk) {
                        const hotModules = this.modules.filter(module => module.hotUpdate);
                        const filename = this.getPath(hotUpdateChunkFilename, {
                            hash: records.hash,
                            chunk: currentChunk
                        });
                        const source = hotUpdateChunkTemplate.render(chunkId, hotModules, this.hash, this.moduleTemplate, this.dependencyTemplates);
                        this.assets[filename] = source;
                        hotUpdateContent.c[currentChunk.id] = true;
                    } else {
                        hotUpdateContent.c = {
                            [chunkId]: false
                        }
                    }

                });
                const filename = this.getPath(hotUpdateMainFilename, {hash: records.hash});
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
