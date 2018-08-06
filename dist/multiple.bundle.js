/******/ (function (modules) {
/******/ 	
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	
/******/ 	function __webpack_require__(moduleId) {
/******/ 		if (installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 		};
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 		module.l = true;
/******/ 		return module.exports;
/******/ 	}
/******/ 	return __webpack_require__(4)
/******/ })
/************************************************************************/
/******/ ({
/***/4:
/***/ (function(module, exports, __webpack_require__) {
console.log('multiple')

/***/ })
/******/ });