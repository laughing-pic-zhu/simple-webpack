require('./b')
require.ensure(['./a'], function () {

})
