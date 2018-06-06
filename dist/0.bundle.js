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
__webpack_require__(1);

exports.test2 = test2;

exports.answer = 42;

/***/}),
/* 1 */
/***/(function(module, exports,__webpack_require__) {
const c = 'c';

module.exports = c;

exports.test2 = test2;

exports.answer = 42;

exports.d = 2000;

/***/}),
/***/]);
