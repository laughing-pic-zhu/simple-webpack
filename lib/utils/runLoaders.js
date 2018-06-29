function runLoaders(options, callback) {
    const {request, fileName, loadersFunction, fs} = options;
    const _loadersFunction = loadersFunction.slice();
    fs.readFile(request, (err, content) => {
        const source = content.toString();
        function nextLoader() {
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
                callback(null, contents[0])
            }
        }
        nextLoader.apply(null, [source]);
    })
}

function getLoaderFunctions(loaders) {
    const loaderFunctions = [];
    loaders.split('!').forEach(str => {
        loaderFunctions.push(require(str));
    });
    return loaderFunctions;
}

module.exports = {
    runLoaders,
    getLoaderFunctions
};
