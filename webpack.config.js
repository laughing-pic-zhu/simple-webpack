const path = require('path');
const webpack = require('./lib/webpack');
const HelloPlugin = require('./example/HelloPlugin');

module.exports = function () {
    return {
        entry: {
            main: './example/a',
        },
        devServer: {
            contentBase: './dist',
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/dist/'
        },
        context: __dirname,
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
        ]
    }
}
