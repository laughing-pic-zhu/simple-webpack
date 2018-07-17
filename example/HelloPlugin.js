function HelloWorldPlugin(options) {
}

HelloWorldPlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', function () {
        console.log('Hello World!');
    });
};

module.exports = HelloWorldPlugin;
