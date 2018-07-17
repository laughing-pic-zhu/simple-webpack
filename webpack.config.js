const path = require('path');
const HelloPlugin = require('./example/HelloPlugin');

module.exports = function () {
    return {
        entry: {
            main: './example/a.js',
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/dist/'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "test-loader!test-loader2"
                }
            ]
        },
        plugins: [new HelloPlugin()]
    }
}
