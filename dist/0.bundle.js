/******/(function (modules) {
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
__webpack_require__(2);
__webpack_require__(1);

/***/}),
/* 1 */
/***/(function(module, exports,__webpack_require__) {
module.exports={
  "foobar": "test2"
}

/***/}),
/* 2 */
/***/(function(module, exports,__webpack_require__) {
const d = 'd';

console.log('d');
module.exports = d;

/***/}),
/***/]);
