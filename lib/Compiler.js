"use strict";

const Tapable = require('tapable');
const Parser = require('./Parser');
const NormalModuleFactory = require('./NormalModuleFactory');
const Resolver = require("enhanced-resolve/lib/Resolver");
const Compilation = require('./Compilation');

class Watch {
    constructor(compiler, watchOption) {
        this.compiler = compiler;
        this.startTime = Date.now();
        if (typeof watchOption === 'object') {
            this.watchOption = {
                aggregateTimeout: watchOption.aggregateTimeout
            }
        } else if (typeof watchOption === 'number') {
            this.watchOption = {
                aggregateTimeout: watchOption
            }
        } else {
            this.watchOption = {}
        }
        this.watchOption.aggregateTimeout = this.watchOption.aggregateTimeout || 2000;
        this._go();
    }

    watch(files, dirs, missing) {
        this.watcher = this.compiler.watchFileSystem.watch(files, dirs, missing, this.startTime, this.watchOption, (changes) => {
            console.log(changes);
            this._go();
        })
    }

    _go() {
        const compiler = this.compiler;
        compiler.compile((err, compilation) => {
            compiler.emitAssets(compilation, err => {
                if (!err) {
                    this._done(compilation.fileDependencies, compilation.contextDependencies, compilation.missingDependencies);
                }
            });
        })
    }

    _done(files, dirs, missing) {
        this.startTime = Date.now();
        this.watch(files, dirs, missing);
    }
}

class Compiler extends Tapable {
    constructor() {
        super();
        this.parser = new Parser();
        this.outputFileSystem = null;
        this.outputPath = '';
        this.outputOptions = this.options && this.options.output;
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
        this.applyPlugins('this-compilation', compilation, params);
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

    watch(options, callback) {
        this.watcher = new Watch(this, options, callback);
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
                    const source = compilation.assets[name];
                    let content = source.source();
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

Compiler.Watch = Watch;
module.exports = Compiler;
