const Tapable = require('tapable');
const Chunk = require('./Chunk');
const Stats = require('./Stats');
const ModuleTemplate = require('./ModuleTemplate');

class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.outputOptions = compiler.outputOptions;
        this.mainTemplate = compiler.mainTemplate;
        this.chunkTemplate = compiler.chunkTemplate;
        this.moduleTemplate = new ModuleTemplate(this.outputOptions, compiler.context);
        this.modules = [];
        this._modules = {};
        this.chunks = [];
        this.entries = [];
        this.fileDependencies = [];
        this.assets = {};
        this.resolver = compiler.resolver;
        this.dependencyFactories = new Map();
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

    sortItems() {
        function sortById(a, b) {
            return a.id - b.id;
        }

        this.chunks.forEach(chunk => {
            chunk.modules.sort(sortById);
        })
    }

    seal(callback) {
        this.applyPlugins("seal");
        this.applyChunkIds();
        this.applyModuleIds();
        this.applyPlugins("optimize-module-ids", this.modules);
        this.applyPlugins("after-optimize-module-ids", this.modules);
        this.applyPlugins("optimize-chunk-ids", this.chunks);
        this.applyPlugins("after-optimize-chunk-ids", this.chunks);
        this.sortItems();
        this.createChunkAssets();
        this.summarizeDependencies();
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
            const module = dep[0].module;
            chunk.addModule(module);
            this.processDependenciesBlockForChunk(module, chunk)
        };

        block.dependencies.forEach(IterateDependency);
    }

    summarizeDependencies() {
        this.modules.forEach(module => {
            this.fileDependencies = this.fileDependencies.concat(module.fileDependencies);
        })
        this.contextDependencies = [];
        this.missingDependencies = [];
    }

    addEntry(context, dependency, name, callback) {
        const entry = dependency.request;
        this.entries.push(entry);
        const factory = this.dependencyFactories.get(dependency.class);
        const chunk = new Chunk({name});
        this.chunks.push(chunk);
        factory.create(context, entry, (module) => {
            this.processDependencies(module, () => {
                chunk.addModule(module);
                chunk.entry = true;
                chunk.chunks = this.chunks;
                module.chunks.push(chunk);

                chunk.entryModule = module;
                this.processDependenciesBlockForChunk(module, chunk);
                callback(null, this);
            })
        });
    }

    getStats() {
        return new Stats(this);
    }

    processDependencies(module, callback) {
        // if (this.cacheModules[module.request]) {
        //     callback();
        //     return;
        // }
        // this.cacheModules[module.request] = module;
        this.modules.push(module);
        module.doBuild(() => {
            const dependencies = [];

            function addDependency(dependency) {
                let flag = true;
                dependencies.forEach((dep, i) => {
                    if (dep[0].request === dependency.request) {
                        dependencies[i].push(dependency);
                        flag = false;
                    }
                });
                if (flag) {
                    dependencies.push([dependency]);
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
                dependencies.forEach(deps => {
                    const dependency = deps[0];
                    const req = dependency.request;
                    const factory = this.dependencyFactories.get(dependency.class);
                    factory.create(module.context, req, (module) => {
                        const identifier = module.identifier();
                        if (!this._modules[identifier]) {
                            this._modules[identifier] = module;
                            dependency.module = module;
                            this.processDependencies(module, () => {
                                len--;
                                if (len === 0) {
                                    callback();
                                }
                            })
                        } else {
                            dependency.module = this._modules[identifier];
                            callback();
                        }
                    });
                });
            }
        });
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
                source = this.mainTemplate.render(chunk, this.moduleTemplate, this.outputOptions);
            } else {
                source = this.chunkTemplate.render(chunk, this.moduleTemplate, this);
            }
            chunk.source = source;
            this.assets[name] = source;
        });
    }
}

module.exports = Compilation;
