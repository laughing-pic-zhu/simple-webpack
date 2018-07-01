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
        this.modules = {};
        this.chunks = [];
        this.context = context;
        this.outputFileSystem = null;
        this.outputPath = '';
        this.resolver = {
            normal: new Resolver(null),
            loader: new Resolver(null),
            context: new Resolver(null)
        }
    }

    applyModuleIds() {

    }

    appluChunkIds() {

    }

    seal() {
        this.applyModuleIds();
    }

    addEntry(context, entry, name, callback) {
        new Chunk();
        this.chunks.push();
    }

    compile(request) {

        const factory = new NormalModuleFactory({
            parser: this.parser,
            resolver: this.resolver,
            context: this.context,
            loader: [],
            request
        });
        factory.create((module) => {
            this.processDependencies(module, () => {
                console.log(this.modules)

            })
        })

    }

    processDependencies(module, callback) {
        if (this.modules[module.request]) {
            callback();
            return;
        }
        this.modules[module.request] = module;
        module.doBuild(() => {
            let len = module.fileDependencies.length;
            if (len === 0) {
                callback();
            } else {
                module.fileDependencies.forEach(fileDependency => {
                    const req = fileDependency.request;
                    const factory = new NormalModuleFactory({
                        parser: this.parser,
                        resolver: this.resolver,
                        context: this.context,
                        loader: [],
                        request: req
                    });

                    factory.create((module) => {
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
