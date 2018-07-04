"use strict";

const Tapable = require('tapable');
const Parser = require('./Parser');
const NormalModuleFactory = require('./NormalModuleFactory');
const Resolver = require("enhanced-resolve/lib/Resolver");
const Chunk = require('./Chunk');

class Compiler extends Tapable {
    constructor(props) {
        super(props);
        const {context} = props;
        this.parser = new Parser();
        this.modules = [];
        this.chunks = [];
        this.context = context;
        this.outputFileSystem = null;
        this.outputPath = '';
        this.entries = [];
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
                return 1
            }
            return 0;
        }

        this.modules.sort(function (a, b) {
            if (occursInEntry(a) > occursInEntry(b)) {
                return 1
            }
            if (occursInEntry(a) < occursInEntry(b)) {
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

    }

    seal() {
        this.applyModuleIds();
        this.createChunkAssets();
    }

    processDependenciesBlockForChunk(block, chunk) {
        block.dependencies.forEach(dep => {
            const module = dep.module;
            chunk.addModule(module);
            this.processDependenciesBlockForChunk(module, chunk)
        });
    }

    addEntry(context, entry, name, callback) {
        this.entries.push(entry);
        const factory = new NormalModuleFactory({
            parser: this.parser,
            resolver: this.resolver,
            context: this.context,
            loader: [],
            request: entry
        });
        factory.create((module) => {
            module.id = 0;
            this.processDependencies(module, () => {
                const chunk = new Chunk({name});
                chunk.addModule(module);
                chunk.entry = true;
                this.chunks.push(chunk);
                this.processDependenciesBlockForChunk(module, chunk);
                this.seal();
                callback();
            })
        });
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
            let len = module.dependencies.length;
            if (len === 0) {
                callback();
            } else {
                module.dependencies.forEach(dependency => {
                    const req = dependency.request;
                    const factory = new NormalModuleFactory({
                        parser: this.parser,
                        resolver: this.resolver,
                        context: this.context,
                        loader: [],
                        request: req
                    });

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
        chunks.forEach(chunk=>{
            this.mainTemplate.render(chunk,source=>{
                console.log(source);
            });

        })
    }

    emitAssets() {
        this.applyPluginsAsync('emit', () => {
            this.outputFileSystem.mkdirp(this.outputPath, emitFiles)
        });

        const emitFiles = () => {
            this.outputFileSystem.writeFile();
            this.assets.forEach()
        };
        const writeOut = () => {

        };
        console.log(this.modules)
    };

}

module.exports = Compiler;
