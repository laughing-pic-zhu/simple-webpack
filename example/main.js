require('d');

function a() {
    require.ensure(['./a'], function () {
        require('./b');
        require('c');
        require('d');
        require('./a');
    });
}

setTimeout(a, 1000);
