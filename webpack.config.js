const path = require('path');

module.exports = function () {
    return {
        entry: {
            main: './example/a.js',
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath:'/dist/'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "test-loader!test-loader2"
                }
            ]
        },
        context: __dirname,
        plugins: [{
            common: {
                name: 'common'
            }
        }]
    }
}
