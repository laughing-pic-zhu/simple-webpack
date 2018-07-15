const Module = require('./Module');
const fs = require('fs');
const RawSource = require('./RawSource');
const ReplaceSource = require('./ReplaceSource');
const path = require('path');

class NormalModule extends Module {
    constructor(props) {
        super(props);
        const {parser, request, loaders, fileName} = props;
        this.parser = parser;
        this.fileDependencies = [request];
        this.dependencies = [];
        this.blocks = [];
        this.loaders = loaders;
        this.request = request;
        this.fileName = fileName;
        this.requires = [];
        this.context = request ? path.dirname(request) : null;
        this.built = false;
    }

    addBlock(dependency) {
        if (this.blocks.indexOf(dependency) === -1) {
            this.blocks.push(dependency);
        }
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
        const {request, fileName, loaders, fs} = options;
        const loadersFunction = loaders.map(loader => require(loader));
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
                    const _source = loaderFun.apply(context, [contents]);
                    if (!async) {
                        nextLoader.apply(null, [_source]);
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

        function dealDependency(dependency) {
            const {module: {id}, range} = dependency;
            if (range) {
                _source.replace(range[0], range[1], id);
            }
        }

        function dealRequire(req) {
            _source.replace(req[0], req[1], '__webpack_require__');
        }

        this.blocks.forEach(block => {
            const {beforeRange, afterRange, chunk} = block;
            _source.replace(beforeRange[0], beforeRange[1], `__webpack_require__.e(${chunk.id}).then(`);
            _source.replace(afterRange[0], afterRange[1], '');
            block.dependencies.forEach(dealDependency);
            block.requires.forEach(dealRequire);
        });

        this.dependencies.forEach(dealDependency);

        this.requires.forEach(dealRequire);

        return _source.source();
    }
}

module.exports = NormalModule;
