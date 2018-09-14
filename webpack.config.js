const path = require('path');
const webpack = require('./lib/webpack');
const HelloPlugin = require('./example/HelloPlugin');

module.exports = function () {
    return {
        entry: {
            main: './example/a',
        },
        devtool: 'source-map',
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/dist/'
        },
        module: {
            rules: [{
                test: /\.js$/,
                use: 'test-loader'
            }]
        },
        context: __dirname,
        plugins: [
            new HelloPlugin(),
        ]
    }
}
