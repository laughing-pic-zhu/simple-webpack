class WebpackOptionsDefaulter {
    process(options) {
        const copy = {
            module: {
                rules: []
            },
            devtool: ''
        };
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
            sourceMapFilename: '[file].map[query]',
            publicPath: '/',
            hashFunction:'md5',
            hashDigest:'hex',
            hotUpdateChunkFilename:'[id].[hash].hot-update.js',
            hotUpdateMainFilename:'[hash].hot-update.json',
            hotUpdateFunction:'webpackHotUpdate'
        };

        console.log({...output, ...options.output || {}})
        return {...copy, resolve, resolveLoader, ...options,output: {...output, ...options.output || {}}};
    }
}

module.exports = WebpackOptionsDefaulter;
