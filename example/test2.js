const b = require('./b');
const c = require('c');
const {e, f, g} = require('./m');

setTimeout(function () {
    console.log('webpack init success');
    console.log(b);
    console.log(c);
    console.log(e);
    console.log(f);
    console.log(g);
});

