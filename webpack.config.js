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
        module: {
            rules: [
                {
                    test: /.js$/,
                    use: '/Users/zhujian/Documents/workspace/webpack/simple-webpack-demo/node_modules/_html-webpack-plugin@3.2.0@html-webpack-plugin/lib/loader.js'
                }
            ]
        },
        context: __dirname,
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
        ]
    }
}
