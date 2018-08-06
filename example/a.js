require('./module!d');
require('./assets/test');
require.ensure(['./e'], function () {
    console.log(1)
    console.log(1)
    console.log(1)
    console.log(1)
});
