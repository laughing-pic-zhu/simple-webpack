const Tapable = require('tapable');
const Chunk = require('./Chunk');
const Stats = require('./Stats');
const ModuleTemplate = require('./ModuleTemplate');
const MainTemplate = require('./MainTemplate');
const JsonpChunkTemplate = require('./JsonpChunkTemplate');
const HotUpdateChunkTemplate = require('./hotUpdateChunkTemplate');
const Entrypoint = require('./Entrypoint');
const crypto = require('crypto');

class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.inputFileSystem = compiler.inputFileSystem;
        const options = this.options = compiler.options;
        this.outputOptions = compiler.outputOptions;
        this.mainTemplate = new MainTemplate(this.outputOptions);
        this.chunkTemplate = new JsonpChunkTemplate(this.outputOptions);
        this.moduleTemplate = new ModuleTemplate(this.outputOptions, compiler.context);
        this.hotUpdateChunkTemplate = new HotUpdateChunkTemplate(this.outputOptions);
        this.modules = [];
        this._modules = {};
        this.chunks = [];
        this.entries = [];
        this.fileDependencies = [];
        this.assets = {};
        this.records = {};
        this.children = [];
        this.entrypoints = {};
        this.resolver = compiler.resolver;
        this.dependencyFactories = new Map();
        this.dependencyTemplates = new Map();
        this.moduleIndex = 0;
    }

    findModule(identifier) {
        return this._modules[identifier];
    }

    applyModuleIds() {
        let i = 0;

        this.modules.sort(function (a, b) {
            return a.index - b.index;
        });

        this.modules.forEach(module => {
            if (module.id === null) {
                module.id = i++;
            }
        })
    }

    applyChunkIds() {
        let i = 0;

        function occursInEntry(c) {
            return c.parents.filter(function (p) {
                return p.entry;
            }).length;
        }

        this.chunks.forEach(chunk => {
            chunk.modules.forEach(module => {
                module.index = this.moduleIndex++;
            })
        });


        this.chunks.sort(function (a, b) {
            if (occursInEntry(a) > occursInEntry(b)) {
                return -1
            }
            if (occursInEntry(a) < occursInEntry(b)) {
                return 1
            }
            return a.id - b.id;
        });

        this.chunks.forEach(chunk => {
            if (chunk.id === null) {
                chunk.id = i++;
            }
        });
    }

    createChildCompiler(name, outputOptions, plugins) {
        let count = this.childrenCount || 0;
        this.childrenCount = ++count;
        return this.compiler.createChildCompiler(this, name, count, outputOptions, plugins);
    }

    templatesPlugin(name, fn) {
        this.mainTemplate.plugin(name, fn);
        this.chunkTemplate.plugin(name, fn);
    }

    sortItems() {
        function sortById(a, b) {
            return a.id - b.id;
        }

        this.chunks.forEach(chunk => {
            chunk.modules.sort(sortById);
        })
    }

    createHash() {
        const {hashFunction, hashDigest} = this.outputOptions;
        const hash = crypto.createHash(hashFunction);
        for (let i = 0; i < this.chunks.length; i++) {
            const chunkHash = crypto.createHash(hashFunction);
            const chunk = this.chunks[i];
            chunk.updateHash(chunkHash);
            chunk.hash = chunkHash.digest(hashDigest);
            hash.update(chunk.hash);
        }
        this.hash = hash.digest(hashDigest)
    }

    seal(callback) {
        this.applyPlugins("seal");
        this.processDependenciesBlockForChunks(this.chunks);
        this.applyChunkIds();
        this.applyModuleIds();
        this.chunks.forEach(chunk => {
            const {name} = chunk;
            const entrypoint = this.entrypoints[name] = new Entrypoint(name);
            entrypoint.unshiftChunk(chunk);
        })
        this.applyPlugins("optimize-module-ids", this.modules);
        this.applyPlugins("after-optimize-module-ids", this.modules);
        this.applyPlugins("optimize-chunk-ids", this.chunks);
        this.applyPlugins("after-optimize-chunk-ids", this.chunks);
        this.sortItems();
        this.applyPlugins0("before-hash");
        this.createHash();
        this.applyPlugins0("after-hash");
        this.createChunkAssets();
        this.summarizeDependencies();
        this.applyPlugins1('additional-chunk-assets', this, this.chunks);
        this.applyPlugins2('record', this, this.records);
        this.applyPluginsAsync('optimize-chunk-assets', this.chunks, err => {
            if (err) {
                return callback(err)
            }
            this.applyPlugins('after-optimize-chunk-assets', this.chunks);
            this.applyPluginsAsync('optimize-assets', this.assets, err => {
                if (err) {
                    return callback(err)
                }
                this.applyPlugins('after-optimize-assets', this.assets);
                callback()
            })
        });
    }

    processDependenciesBlockForChunks(chunks) {
        chunks.forEach(chunk => {
            const module = chunk.entryModule;
            this.processDependenciesBlockForChunk(module, chunk);
        })
    }

    processDependenciesBlockForChunk(block, chunk) {
        block.chunk = chunk;
        block.blocks.forEach(b => {
            chunk.blocks = true;
            const c = new Chunk({name: ''});
            c.addParent(chunk);
            this.chunks.push(c);
            b.chunk = c;
            this.processDependenciesBlockForChunk(b, c);
        });

        const IterateDependency = dep => {
            const module = dep.module;
            if (module) {
                chunk.addModule(module);
                this.processDependenciesBlockForChunk(module, chunk)
            }
        };

        block.dependencies.forEach(IterateDependency);
    }

    summarizeDependencies() {
        this.modules.forEach(module => {
            if (module.fileDependencies) {
                this.fileDependencies = this.fileDependencies.concat(module.fileDependencies);
            }
        })
        this.contextDependencies = [];
        this.missingDependencies = [];
    }

    _addModuleChain(context, dependency, onModule, callback) {
        const factory = this.dependencyFactories.get(dependency.class);
        factory.create(context, dependency, (module) => {
            onModule();
            this.processModuleDependencies(module, () => {
                callback(null, module);
            })
        });
    }

    addEntry(context, dependency, name, callback) {
        const chunk = new Chunk({name});
        this.chunks.push(chunk);
        chunk.chunks = this.chunks;
        this._addModuleChain(context, dependency, () => {
            dependency.module = module;
            this.entries.push(module);
        }, (err, module) => {
            if (err) {
                callback(err);
                return;
            }
            chunk.addModule(module);
            chunk.entry = true;
            module.chunks.push(chunk);
            chunk.entryModule = module;
            callback(null, module);
        })
    }

    getStats() {
        return new Stats(this);
    }

    processModuleDependencies(module, callback) {
        this.modules.push(module);
        module.doBuild(this, this.inputFileSystem, () => {
                const dependencies = [];

                function addDependency(dependency) {
                    let flag = true;
                    dependencies.forEach((dep, i) => {
                        // if (dep.request === dependency.request) {
                        //     dependencies[i].push(dependency);
                        //     flag = false;
                        // }
                    });
                    if (flag) {
                        dependencies.push(dependency);
                    }
                }

                function addDependenciesBlock(block) {
                    block.dependencies.forEach(addDependency);
                    block.blocks.forEach(addDependenciesBlock);
                }

                addDependenciesBlock(module);
                module.dependencies = dependencies;
                let len = dependencies.length;
                if (len === 0) {
                    const identifier = module.identifier();
                    this._modules[identifier] = module;
                    callback();
                } else {
                    dependencies.forEach(dependency => {
                        const factory = this.dependencyFactories.get(dependency.constructor);
                        factory.create(module.context, dependency, (module) => {
                            if (!module) {
                                len--;
                                if (len === 0) {
                                    callback();
                                }
                                return;
                            }
                            const identifier = module.identifier();

                            if (!this._modules[identifier]) {
                                this._modules[identifier] = module;
                                dependency.module = module;
                                this.processModuleDependencies(module, () => {
                                    len--;
                                    if (len === 0) {
                                        callback();
                                    }
                                })
                            } else {
                                dependency.module = this._modules[identifier];
                                len--;
                                if (len === 0) {
                                    callback();
                                }
                            }
                        });
                    });
                }
            }
        );
    }

    getPath(path, data) {
        return this.mainTemplate.applyPluginsWaterfall('asset-path', path, data);
    }

    createChunkAssets() {
        const chunks = this.chunks;
        const {filename, chunkFilename} = this.outputOptions;
        chunks.forEach(chunk => {
            let name = chunk.entry ? filename : chunkFilename;
            name = this.getPath(name, {chunk});
            chunk.files.push(name);
            let source;
            if (chunk.entry) {
                source = this.mainTemplate.render(this.hash, chunk, this.moduleTemplate, this.outputOptions, this.dependencyTemplates);
            } else {
                source = this.chunkTemplate.render(chunk, this.moduleTemplate, this);
            }
            chunk.source = source;
            this.assets[name] = source;
        });
    }
}

module.exports = Compilation;
