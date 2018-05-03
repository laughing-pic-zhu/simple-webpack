/******/(function (modules) {
/******/    var installedModules = {};
/******/
/******/    function __webpack_require__(moduleId) {
/******/        if (installedModules[moduleId]) {
/******/            return installedModules[moduleId].exports;
/******/        }
/******/
/******/        var module = installedModules[moduleId] = {
/******/            exports: {},
/******/            i: moduleId,
/******/            l: false,
/******/        };
/******/        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/        module.l = true;
/******/        return module.exports;
/******/    }
/******/    return __webpack_require__(0)
/******/})
/************************************************************************/
/******/([
/* 0 */
/***/(function(module, exports,__webpack_require__) {
const b = __webpack_require__(3);
const c = __webpack_require__(2);
const {e, f, g} = __webpack_require__(3);

setTimeout(function () {
    console.log('webpack init success');
    console.log(b);
    console.log(c);
    console.log(e);
    console.log(f);
    console.log(g);
});

function test(){
    const d = __webpack_require__(4);
}

/***/}),
/* 1 */
/***/(function(module, exports,__webpack_require__) {
const b = 'b';
const c = __webpack_require__(2);
const m = __webpack_require__(3);
module.exports = b;

/***/}),
/* 2 */
/***/(function(module, exports,__webpack_require__) {
const c = 'c';

module.exports = c;

/***/}),
/* 3 */
/***/(function(module, exports,__webpack_require__) {
// const core = require('./core');
const a = 1;

module.exports = {
    e: 'e',
    f: 'f',
    g: 'g'
};

/***/}),
/* 4 */
/***/(function(module, exports,__webpack_require__) {
const d = 'd';

module.exports = d;

/***/})
/***/]);
