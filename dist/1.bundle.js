webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */
/***/(function(module, exports,__webpack_require__) {
const b = require('./b');
const c = require('c');
const {e, f, g} = require('./m');

__webpack_require__(function () {
    console.log('webpack init success');
    console.log(b);
    console.log(c);
    console.log(e);
    console.log(f);
    console.log(g);
});

function test(){
    const d = require('d');
}

/***/}),
/* 3 */
/***/(function(module, exports,__webpack_require__) {
const b = 'b';
const c = require('c');
const m = require('./m');
module.exports = b;

/***/}),
/* 4 */
/***/(function(module, exports,__webpack_require__) {
const c = 'c';

module.exports = c;

/***/}),
/***/]);
