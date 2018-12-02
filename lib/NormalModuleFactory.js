const Tapable = require('tapable');
const NormalModule = require('./NormalModule');
const async = require('async');
const path = require('path');

class NormalModuleFactory extends Tapable {
    constructor(props) {
        super(props);
        const {context, resolver, parser, options} = props;
        this.resolver = resolver;
        this.parser = parser;
        this.options = options;
        this.context = context;
    }

    create(context, dependency, callback) {
        const request = dependency.request;
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
                    resolver.normal.resolve({}, context, req, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, result)
                        }
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
                        const module = new NormalModule({
                            parser: this.parser,
                            request: _resource,
                            loaders,
                            rawRequest: req,
                            fileName: path.basename(_resource)
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
}

module.exports = NormalModuleFactory;
