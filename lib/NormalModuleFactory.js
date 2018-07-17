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

    create(context, request, callback) {
        const {resolver} = this;
        const loader = request.split('!');
        const req = loader.pop();
        this.applyPluginsAsyncWaterfall('before-resolve', {}, () => {
            async.parallel([
                (callback) => {
                    this.requestResolverArray(context, loader, resolver, callback)
                },
                (callback) => {
                    resolver.normal.resolve(context, req, callback);
                },
            ], (err, result) => {
                let loaders = result[0];
                const resource = result[1];

                const preLoader = this.split(resource);

                this.requestResolverArray(context, preLoader, resolver, (err, res) => {
                    if (!err) {
                        loaders = loaders.concat(res);
                        const module = new NormalModule({
                            parser: this.parser,
                            request: resource,
                            loaders,
                            fileName: path.basename(resource)
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
            const {test, loader} = rule;
            if (test.test(resource)) {
                loaders = loaders.concat(loader.split('!'));
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
            resolver.loader.resolve(context, item, callback);
        }, callback)
    }
}

module.exports = NormalModuleFactory;
