class WebpackOptionsDefaulter {
    process(options) {
        const copy = {};
        copy.module = {};
        copy.module.rules = [];
        const resolve = {
            unsafeCache: true,
            cacheWithContext: false,
            modules: ["node_modules"],
            extensions: [".js", ".json"],
            mainFiles: ["index"],
            mainFields: ["browser", "module", "main"],
            aliasFields: ["browser"]
        };

        const resolveLoader = {
            cacheWithContext: false,
            unsafeCache: true,
            mainFields: ["loader", "main"],
            extensions: [".js", ".json"],
            mainFiles: ["index"],
        };

        const output = {
            filename: '[name].js',
            chunkFilename: '',
            jsonpFunction: 'webpackJsonp',
            publicPath: '/'
        };

        return {...copy, resolve, resolveLoader, ...output, ...options};
    }
}

module.exports = WebpackOptionsDefaulter;
