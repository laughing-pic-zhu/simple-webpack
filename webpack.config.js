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
        plugins: [{
            common: {
                name: 'common'
            }
        }]
    }
}
