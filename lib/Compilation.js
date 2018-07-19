const Tapable = require('tapable');
const Chunk = require('./Chunk');
const Stats = require('./Stats');

class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.outputOptions = compiler.outputOptions;
        this.mainTemplate = compiler.mainTemplate;
        this.chunkTemplate = compiler.chunkTemplate;
        this.modules = [];
        this.chunks = [];
        this.entries = [];
        this.assets = {};
        this.resolver = compiler.resolver;
        this.dependencyFactories = new Map();
    }

    applyModuleIds() {
        let i = 0;

        function occursInEntry(m) {
            if (m.entry) {
                return 0
            }
            return 1;
        }

        function occursChunkInEntry(m) {
            if (m.chunk.entry) {
                return 0
            }
            return 1;
        }

        this.modules.sort(function (a, b) {
            if (occursInEntry(a) > occursInEntry(b)) {
                return 1
            }
            if (occursInEntry(a) < occursInEntry(b)) {
                return -1
            }

            if (occursChunkInEntry(a) > occursChunkInEntry(b)) {
                return 1
            }
            if (occursChunkInEntry(a) < occursChunkInEntry(b)) {
                return -1
            }


            return a.identifier() - b.identifier();
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
            if (chunk.id === null) {
                chunk.id = ++i;
            }
        });

        this.chunks.sort(function (a, b) {
            if (occursInEntry(a) > occursInEntry(b)) {
                return 1
            }
            if (occursInEntry(a) < occursInEntry(b)) {
                return -1
            }
            return a.id - b.id;
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
        this.applyModuleIds();
        this.applyChunkIds();
        this.applyPlugins("optimize-module-ids", this.modules);
        this.applyPlugins("after-optimize-module-ids", this.modules);
        this.applyPlugins("optimize-chunk-ids", this.chunks);
        this.applyPlugins("after-optimize-chunk-ids", this.chunks);
        this.sortItems();
        this.createChunkAssets();
        this.applyPluginsAsync('optimize-chunk-assets', this.chunks, err => {
            if (err) {
                return callback(err)
            }
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
            const c = new Chunk({name: ''});
            c.addParent(chunk);
            this.chunks.push(c);
            b.chunk = c;
            this.processDependenciesBlockForChunk(b, c);
        });

        const IterateDependency = dep => {
            const module = dep.module;
            chunk.addModule(module);
            this.processDependenciesBlockForChunk(module, chunk)
        };

        block.dependencies.forEach(IterateDependency);
    }

    addEntry(context, dependency, name, callback) {
        const entry = dependency.request;
        this.entries.push(entry);
        const factory = this.dependencyFactories.get(dependency.class);
        factory.create(context, entry, (module) => {
            this.processDependencies(module, () => {
                const chunk = new Chunk({name});
                chunk.addModule(module);
                chunk.entry = true;
                chunk.chunks = this.chunks;
                module.chunk = chunk;
                this.chunks.push(chunk);
                this.processDependenciesBlockForChunk(module, chunk);
                callback(null,this);
            })
        });
    }

    getStats() {
        return new Stats(this);
    }

    processDependencies(module, callback) {
        if (this.modules[module.request]) {
            callback();
            return;
        }
        this.modules.push(module);
        module.doBuild(() => {
            const dependencies = [];

            function addDependency(dependency) {
                dependencies.push(dependency);
            }

            function addDependenciesBlock(block) {
                block.dependencies.forEach(addDependency);
                block.blocks.forEach(addDependenciesBlock);
            }

            addDependenciesBlock(module);
            let len = dependencies.length;
            if (len === 0) {
                callback();
            } else {
                dependencies.forEach(dependency => {
                    const req = dependency.request;
                    const factory = this.dependencyFactories.get(dependency.class);
                    factory.create(module.context, req, (module) => {
                        dependency.module = module;
                        this.processDependencies(module, () => {
                            len--;
                            if (len === 0) {
                                callback();
                            }
                        })
                    });
                });
            }
        });
    }

    createChunkAssets() {
        const chunks = this.chunks;
        chunks.forEach(chunk => {
            const filename = chunk.entry ? this.outputOptions.filename.replace('[name]', chunk.name) : this.outputOptions.filename.replace('[name]', chunk.id);
            this.assets[filename] = chunk;
            let source;
            if (chunk.entry) {
                source = this.mainTemplate.render(chunk, this.outputOptions);
            } else {
                source = this.chunkTemplate.render(chunk, this);
            }
            chunk.source = source;
        });
    }
}

module.exports = Compilation;
