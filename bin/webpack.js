const webpack = require('../lib/webpack.js');
const yargs = require('yargs');
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
options.loaders = [
    {
        test: /\.css$/,
        loader: "css-loader"
    },
    {
        test: /\.json/,
        loader: "json-loader"
    },
    {
        test: /\.js$/,
        loader: "test-loader!test-loader2"
    }
];
webpack(options);
