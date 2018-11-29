"use strict";

const Tapable = require('tapable');
const Parser = require('./Parser');
const NormalModuleFactory = require('./NormalModuleFactory');
const ContextModuleFactory = require('./ContextModuleFactory');
const Resolver = require("enhanced-resolve/lib/Resolver");
const Compilation = require('./Compilation');
const Stats = require('./Stats');

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
            this._go();
        })
    }

    _go() {
        const compiler = this.compiler;
        compiler.compile((err, compilation) => {
            compiler.emitAssets(compilation, err => {
                if (!err) {
                    this._done(compilation);
                }
            });
        })
    }

    _done(compilation) {
        const {fileDependencies, contextDependencies, missingDependencies} = compilation;
        const stats = compilation.getStats(compilation);
        this.startTime = Date.now();
        this.compiler.applyPlugins('done', stats)
        this.watch(fileDependencies, contextDependencies, missingDependencies);
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
        this.children = [];
        this.options = {};
    }

    getParams() {
        const query = {
            context: this.context,
            resolver: this.resolver,
            parser: this.parser,
            options: this.options
        };
        const normalModuleFactory = new NormalModuleFactory(query);
        const contextModuleFactory = new ContextModuleFactory(query);

        return {
            normalModuleFactory,
            contextModuleFactory
        }
    }

    getStats() {
        return new Stats(this);
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

    runAsChild(callback) {
        this.compile((err, compilation) => {
            if (err) return callback(err);

            this.parentCompilation.children.push(compilation);
            Object.keys(compilation.assets).forEach(name => {
                this.parentCompilation.assets[name] = compilation.assets[name];
            });

            const entries = Object.keys(compilation.entrypoints).map(name => {
                return compilation.entrypoints[name].chunks;
            }).reduce((array, chunks) => {
                return array.concat(chunks);
            }, []);

            return callback(null, entries, compilation);
        });
    }

    createChildCompiler(compilation, name, count, outputOptions, plugins) {
        const newCompiler = new Compiler();
        if (Array.isArray(plugins)) {
            newCompiler.apply(plugins);
        }
        newCompiler.outputPath = this.outputPath;
        newCompiler.name = name;
        newCompiler.outputOptions = Object.create(this.outputOptions);

        for (const name in outputOptions) {
            newCompiler.outputOptions[name] = outputOptions[name];
        }

        newCompiler.resolver = this.resolver;
        newCompiler.options = Object.create(this.options);
        newCompiler.parentCompilation = compilation;
        newCompiler.parser = this.parser;
        newCompiler.inputFileSystem = this.inputFileSystem;
        for (const name in this._plugins) {
            if (["make", "compile", "emit", "after-emit", "invalid", "done", "this-compilation"].indexOf(name) < 0)
                newCompiler._plugins[name] = this._plugins[name].slice();
        }

        return newCompiler;
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

        this.applyPluginsAsync('emit', compilation, () => {
            this.outputFileSystem.mkdirp(this.outputPath, emitFiles)
        });
    };

}

Compiler.Watch = Watch;
module.exports = Compiler;
