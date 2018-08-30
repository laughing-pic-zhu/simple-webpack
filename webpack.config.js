const path = require('path');
const webpack = require('./lib/webpack');
const HelloPlugin = require('./example/HelloPlugin');

module.exports = function () {
    return {
        entry: {
            main: './example/a',
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/dist/'
        },
        module: {
            rules: []
        },
        context: __dirname,
        plugins: [
            new HelloPlugin(),
            new webpack.SourceMapDevToolPlugin({
                filename: '[name].js.map',
            })
        ]
    }
}
