const Tapable = require('tapable');
const NormalModule = require('./NormalModule');
const async = require('async');

class NormalModuleFactory extends Tapable {
    constructor(props) {
        super(props);
        const {resolver, context, loader, request, parser} = props;
        this.resolver = resolver;
        this.context = context;
        this.loader = loader;
        this.request = request;
        this.parser = parser;
    }

    create() {
        const {resolver, context, loader, request} = this;
        this.applyPluginsAsyncWaterfall('before-resolve', {}, () => {
            async.parallel([
                (callback) => {
                    this.requestResolverArray(context, loader, resolver, callback)
                },
                (callback) => {
                    resolver.normal.resolve(context, request, callback);
                },
            ], (err, result) => {
                const loader = result[0];
                const resource = result[1];
                console.log(result)
            })
        })
    }

    requestResolverArray(context, array, resolver, callback) {
        if (array.length === 0) {
            callback();
            return;
        }
        async.map(array, function (item, callback) {
            resolver.resolve(context, item, callback);
        }, callback)
    }
}

module.exports = NormalModuleFactory;
