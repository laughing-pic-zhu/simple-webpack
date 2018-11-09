const Tapable = require('tapable');
const NormalModule = require('./NormalModule');
const async = require('async');
const path = require('path');

class NormalModuleFactory extends Tapable {
    constructor(props) {
        super(props);
        const {resolver, parser, rules} = props;
        this.resolver = resolver;
        this.parser = parser;
        this.rules = rules;
    }

    create(context, dependency, callback) {
        const request = dependency.request;
        const {resolver} = this;
        const loader = request.split('!');
        const req = loader.pop();
        this.applyPluginsAsyncWaterfall('before-resolve', {}, () => {
            const contextInfo = {
                issuer: '/Users/zhujian/Documents/workspace/webpack/simple-webpack/example/assets/test.js'
            };
            async.parallel([
                (callback) => {
                    this.requestResolverArray(context, loader, resolver, callback)
                },
                (callback) => {
                    resolver.normal.resolve({}, context, req, function (err, result) {
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
        this.rules.forEach(rule => {
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
