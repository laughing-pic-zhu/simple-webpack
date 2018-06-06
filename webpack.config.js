const path = require('path');

module.exports = function () {
    return {
        entry: {
            main: '../example/main.js',
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "test-loader!test-loader2"
                }
            ]
        },
        plugins: [{
            common: {
                name: 'common'
            }
        }]
    }
}
