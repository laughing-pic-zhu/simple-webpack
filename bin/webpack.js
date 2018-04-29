const webpack = require('../lib/webpack.js');
const yargs = require('yargs');
const getConfig = require('../webpack.config.js');

const options = getConfig();

webpack(options);
