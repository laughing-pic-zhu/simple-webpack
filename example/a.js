require('./module!d');
require('./assets/test');
require.ensure(['./e','./b'], function () {
    console.log(1)
    console.log(1)
    console.log(1)
    console.log(1)
    require('./m');
    require('./e');
});
