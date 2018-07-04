const Module = require('./Module');
const fs = require('fs');
const RawSource = require('./RawSource');
const ReplaceSource = require('./ReplaceSource');

class NormalModule extends Module {
    constructor(props) {
        super(props);
        const {parser, request, loaders, fileName} = props;
        this.parser = parser;
        this.fileDependencies = [request];
        this.dependencies = [];
        this.loaders = loaders;
        this.request = request;
        this.fileName = fileName;
        this.requires = [];
        this.built = false;
    }

    addDependency(dependency) {
        if (this.dependencies.indexOf(dependency) === -1) {
            this.dependencies.push(dependency);
        }
    }

    removeDenpendency(dependency) {
        const ids = this.dependencies.indexOf(dependency);
        if (ids >= 0) {
            this.dependencies.splice(ids, 1);
        }
    }

    addRequire(range) {
        if (this.requires.indexOf(range) === -1) {
            this.requires.push(range)
        }
    }

    identifier() {
        return this.request;
    }

    doBuild(callback) {
        this.built = true;
        const {request, loaders, fileName} = this;
        this.runLoaders({
            request,
            loaders,
            loadersFunction: [],
            fileName,
            fs,
        }, (err) => {
            if (!err) {
                const source = this._source;
                this.parser.parse(source.source(), {
                    current: this,
                    module: this
                });
                callback();
            }
        })
    }

    runLoaders(options, callback) {
        const {request, fileName, loadersFunction, fs} = options;
        const _loadersFunction = loadersFunction.slice();
        fs.readFile(request, (err, content) => {
            const source = content.toString();
            const nextLoader = contents => {
                let async = false;
                if (_loadersFunction.length > 0) {
                    const loaderFun = _loadersFunction.pop();
                    const context = {
                        fileName,
                        options,
                        debug: options.debug,
                        async: function () {
                            async = true;
                            return nextLoader;
                        },
                        callback: function () {
                            async = true;
                            nextLoader.apply(null, arguments)
                        }
                    };
                    const _source = loaderFun.apply(context, contents);
                    if (!async) {
                        nextLoader.apply(null, _source);
                    }
                } else {
                    this._source = new RawSource(contents);
                    callback()
                }
            };
            nextLoader(source);
        })
    }

    //replace require&dependencies
    source() {
        const _source = new ReplaceSource(this._source);
        this.dependencies.forEach(dependency => {
            const {module: {id}, range} = dependency;
            _source.replace(range[0], range[1], id);
        });
        this.requires.forEach(req => {
            _source.replace(req[0], req[1], '__webpack_require__');
        });

        return _source.source();
        // _source.replace();
        // console.log(_source.source())
    }
}

module.exports = NormalModule;
