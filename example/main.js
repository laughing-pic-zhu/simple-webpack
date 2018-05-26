require('d');

function a() {
    require.ensure(['./a'], function () {
        require('c');
    });
}

require.ensure(['./b'], function () {
    require('./m');
});

require('./e');
