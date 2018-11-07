const fs = require("fs");
const path = require("path");

module.exports = function (argv) {
    const configFile = path.resolve('webpack.config.js');
    var options = require(configFile);

    function processOptions(options) {
        if(typeof options === "function") {
            options = options(argv.env, argv);
        }
        return options
    }

    options=processOptions(options);

    return options
};
