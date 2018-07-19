"use strict";

const Tapable = require('tapable');
const Parser = require('./Parser');
const NormalModuleFactory = require('./NormalModuleFactory');
const Resolver = require("enhanced-resolve/lib/Resolver");
const Compilation = require('./Compilation');


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
        this.outputOptions = this.options && this.options.output;
        this.entries = [];
        this.assets = {};
        this.mainTemplate = this.chunkTemlate = null;
        this.resolver = {
            normal: new Resolver(null),
            loader: new Resolver(null),
            context: new Resolver(null)
        }
    }

    getParams() {
        const normalModuleFactory = new NormalModuleFactory({
            resolver: this.resolver,
            parser: this.parser,
            rules: this.rules
        });

        return {
            normalModuleFactory
        }
    }

    newCompilation(params) {
        const compilation = new Compilation(this);
        this.applyPlugins('compilation', compilation, params);
        return compilation;
    }

    run(callback) {
        this.applyPluginsAsync('run', this, err => {
            if (err) return callback(err);
            const startTime = Date.now();
            this.compile((err, compilation) => {
                this.emitAssets(compilation, err => {
                    const stats = compilation.getStats();
                    const endTime = Date.now();
                    stats.startTime = startTime;
                    stats.endTime = endTime;
                    this.applyPlugins('done', stats);
                    callback(null, stats);
                });
            })
        });
    }

    compile(callback) {
        const params = this.getParams();
        this.applyPlugins("compile", params);
        const compilation = this.newCompilation(params);
        this.applyPluginsParallel('make', compilation, err => {
            if (err) {
                return callback(err);
            }
            compilation.seal(err => {
                if (err) {
                    return callback(err);
                }
                this.applyPluginsAsync('after-compile', compilation, function (err) {
                    if (!err) {
                        return callback(null, compilation);
                    }
                })
            });
        })
    }

    emitAssets(compilation, callback) {
        const emitFiles = () => {
            require("async").forEach(Object.keys(compilation.assets), (name, callback) => {
                    const chunk = compilation.assets[name];
                    let content = chunk.source.source();
                    if (!Buffer.isBuffer(content)) {
                        content = new Buffer(content, 'utf-8');
                    }
                    this.outputFileSystem.writeFile(this.outputFileSystem.join(this.outputPath, name), content, callback);
                }, err => {
                    if (!err) {
                        this.applyPluginsAsync('after-emit', compilation, function (err) {
                            if (!err) {
                                callback();
                            }
                        })
                    }
                }
            )
        };

        this.applyPluginsAsync('emit', () => {
            this.outputFileSystem.mkdirp(this.outputPath, emitFiles)
        });
    };

}

module.exports = Compiler;
