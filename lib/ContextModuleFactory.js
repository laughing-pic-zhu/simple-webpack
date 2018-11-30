const Tapable = require('tapable');
const ContextModule = require('./ContextModule');
const ContextElementDependency = require('./dependencies/ContextElementDependency');
const async = require('async');
const path = require('path');

class ContextModuleFactory extends Tapable {
    constructor(props) {
        super(props);
        const {context, resolver, parser, options} = props;
        this.resolver = resolver;
        this.parser = parser;
        this.options = options;
        this.context = context;
    }

    create(context, dependency, callback) {
        const {request, recursive, regExp} = dependency
        const {resolver} = this;
        const loader = request.split('!');
        const req = loader.pop();
        context = context || this.context;
        this.applyPluginsAsyncWaterfall('before-resolve', {}, () => {
            const contextInfo = {
                issuer: ''
            };
            async.parallel([
                (callback) => {
                    this.requestResolverArray(context, loader, resolver, callback)
                },
                (callback) => {
                    resolver.context.resolve({}, context, req, function (err, result) {
                        callback(null, result)
                    });
                },
            ], (err, result) => {
                let loaders = result[0];
                const resource = result[1];

                const preLoader = this.split(resource);
                const splittedResource = resource.split('?');
                const _resource = splittedResource && splittedResource[0];
                this.requestResolverArray(context, preLoader, resolver, (err, res) => {
                    if (!err) {
                        loaders = loaders.concat(res);
                        const module = new ContextModule({
                            parser: this.parser,
                            context,
                            recursive,
                            regExp,
                            resolveDependencies: this.resolveDependencies.bind(this),
                            loaders,
                            rawRequest: req,
                            request: resource,
                        });
                        callback(module)
                    }
                });

            })
        })
    }

    split(resource) {
        let loaders = [];
        this.options.module.rules.forEach(rule => {
            const {test, use} = rule;
            if (test.test(resource)) {
                loaders = loaders.concat(use.split('!'));
            }
        });
        return loaders;
    }

    requestResolverArray(context, array, resolver, callback) {
        if (array.length === 0) {
            callback(null, []);
            return;
        }
        async.map(array, function (item, callback) {
            resolver.loader.resolve({}, context, item, callback);
        }, callback)
    }

    resolveDependencies(fs, request, recursive, regExp, callback) {
        const addDirectory = (directory, callback) => {
            fs.readdir(directory, (err, files) => {
                if (err) {
                    callback(err);
                }

                async.map(files.filter(file => file.indexOf('.') !== 0), (file, callback) => {
                    const subResource = path.join(directory, file);
                    fs.stat(subResource, (err, stat) => {
                        if (err) {
                            return callback(err);
                        }

                        if (stat.isDirectory() && recursive) {
                            addDirectory(subResource, callback)
                        }

                        if (stat.isFile()) {
                            const obj = {
                                context: directory,
                                request: '.' + subResource.substr(directory.length)
                            }
                            // regExp.test('./' + file)
                            this.applyPluginsAsyncWaterfall('alternatives', [obj], (err, alternatives) => {
                                alternatives = alternatives.filter(obj => regExp.test(obj.request)).map(obj => {
                                    const dep = new ContextElementDependency(obj.request);
                                    dep.optional = true;
                                    return dep;
                                });
                                callback(null, alternatives)
                            })
                        } else {
                            callback(null, []);
                        }

                    })
                }, (err, files) => {
                    files = files.filter(file => file.length > 0).reduce((a, b) => a.concat(b), [])
                    callback(null, files)
                })
            })
        }

        addDirectory(request, callback);


    }


}

module.exports = ContextModuleFactory;
