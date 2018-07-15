"use strict";

const Tapable = require('tapable');
const Parser = require('./Parser');
const NormalModuleFactory = require('./NormalModuleFactory');
const Resolver = require("enhanced-resolve/lib/Resolver");
const Chunk = require('./Chunk');

class Compiler extends Tapable {
    constructor() {
        super();
        this.parser = new Parser();
        this.modules = [];
        this.loader = [];
        this.chunks = [];
        this.context = '';
        this.outputFileSystem = null;
        this.outputPath = '';
        this.outputOptions = this.options && this.options.output ;
        this.entries = [];
        this.assets = {};
        this.mainTemplate = this.chunkTemlate = null;
        this.resolver = {
            normal: new Resolver(null),
            loader: new Resolver(null),
            context: new Resolver(null)
        }
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
                module.id = ++i;
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

        this.chunks.sort(function (a, b) {
            if (occursInEntry(a) > occursInEntry(b)) {
                return 1
            }
            if (occursInEntry(a) < occursInEntry(b)) {
                return -1
            }
            return a.identifier() - b.identifier();
        });

        this.chunks.forEach(module => {
            if (module.id === null) {
                module.id = ++i;
            }
        })
    }

    sortItems() {
        function sortById(a, b) {
            return a.id - b.id;
        }

        this.chunks.forEach(chunk => {
            chunk.modules.sort(sortById);
        })
    }

    seal() {
        this.applyModuleIds();
        this.applyChunkIds();
        this.sortItems();
        this.createChunkAssets();
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

    addEntry(context, entry, name, callback) {
        this.entries.push(entry);
        const factory = this.createModuleFactory(context, entry);
        factory.create((module) => {
            module.id = 0;
            this.processDependencies(module, () => {
                const chunk = new Chunk({name});
                chunk.addModule(module);
                chunk.entry = true;
                chunk.chunks = this.chunks;
                chunk.id = 0;
                module.chunk = chunk;
                this.chunks.push(chunk);
                this.processDependenciesBlockForChunk(module, chunk);
                this.seal();
                callback();
            })
        });
    }

    createModuleFactory(context, request) {
        const loader = request.split('!');
        const req = loader.pop();
        const factory = new NormalModuleFactory({
            parser: this.parser,
            resolver: this.resolver,
            context,
            rules: this.rules,
            loader: loader,
            request: req,
            loaders: this.rules
        });
        return factory
    }

    compile(context, request, name, callback) {
        this.addEntry(context, request, name, callback);
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
                    const factory = this.createModuleFactory(module.context, req);
                    factory.create((module) => {
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
                source = this.chunkTemlate.render(chunk,this);
            }
            chunk.source = source;
        })
        this.emitAssets();
    }

    emitAssets() {
        const emitFiles = () => {
            Object.keys(this.assets).forEach(name => {
                const chunk = this.assets[name];
                let content = chunk.source.source();
                if (!Buffer.isBuffer(content)) {
                    content = new Buffer(content, 'utf-8');
                }
                this.outputFileSystem.writeFile(this.outputFileSystem.join(this.outputPath, name), content);
            })
        };
        this.applyPluginsAsync('emit', () => {
            this.outputFileSystem.mkdirp(this.outputPath, emitFiles)
        });
    };

}

module.exports = Compiler;
