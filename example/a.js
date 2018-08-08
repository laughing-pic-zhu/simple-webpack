require('./module!d');
require('./assets/test');
require.ensure(['./e'], function () {
    const e = require('./e');
    console.log(1)
    console.log(1)
    console.log(1)
    console.log(1)
});
