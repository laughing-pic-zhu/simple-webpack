const path = require('path');
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
            rules: [

            ]
        },
        plugins: [new HelloPlugin()]
    }
}
