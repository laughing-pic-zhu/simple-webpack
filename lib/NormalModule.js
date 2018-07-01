const Module = require('./Module');
const fs = require('fs');
const Source = require('./Source');

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
                this.parser.parse(source, {
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
            const nextLoader = () => {
                let async = false;
                const contents = Array.prototype.slice.apply(arguments);
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
                    this._source = new Source(contents[0]);
                    callback()
                }
            }

            nextLoader.apply(null, [source]);
        })
    }
}

module.exports = NormalModule;
