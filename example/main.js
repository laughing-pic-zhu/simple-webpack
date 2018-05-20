require('d');
require.ensure(['./a'], function () {
    require('./b');
    require('c');
    require('d');
});
