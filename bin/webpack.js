const webpack = require('../lib/webpack.js');
const getConfig = require('../webpack.config.js');

const options = getConfig();
options.context = options.context || process.cwd();
const mod = options.module || {};
options.loaders = mod.rules || [];

webpack(options);
