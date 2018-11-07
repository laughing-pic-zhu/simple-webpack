const webpack = require('../lib/webpack.js');

var args = require("yargs")
    .usage("webpack " + require("../package.json").version).argv;

const options = require('./convert-argv')(args);

options.context = options.context || process.cwd();

const mod = options.module || {};

options.loaders = mod.rules || [];

webpack(options);
