const webpack = require('../lib/webpack.js');
const getConfig = require('../webpack.config.js');

const options = getConfig();

let entryObj = {};
const {output, entry} = options;

if (typeof entry === 'string') {
    entryObj['index'] = entry;
} else if (typeof entry === 'object') {
    entryObj = entry;
}

options.entry = entryObj;
options.context = options.context || process.cwd();
const mod = options.module || {};
options.loaders = mod.rules || [];

webpack(options);
