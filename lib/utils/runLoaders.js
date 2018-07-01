function

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
