/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/  	var installedModules = {};
/******/
/******/  	function __webpack_require__(moduleId) {
/******/  		if (installedModules[moduleId]) {
/******/  			return installedModules[moduleId].exports;
/******/  		}
/******/  		var module = installedModules[moduleId] = {
/******/  			exports: {},
/******/  			i: moduleId,
/******/  			l: false,
/******/  		};
/******/  		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/  		module.l = true;
/******/  		return module.exports;
/******/  	}
/******/
/******/  	// expose the modules object (__webpack_modules__)
/******/  	__webpack_require__.m = modules;
/******/
/******/  	// expose the module cache
/******/  	__webpack_require__.c = installedModules;
/******/
/******/  	// define getter function for harmony exports
/******/  	__webpack_require__.d = function(exports, name, getter) {
/******/  		if(!__webpack_require__.o(exports, name)) {
/******/  			Object.defineProperty(exports, name, {
/******/  				configurable: false,
/******/  				enumerable: true,
/******/  				get: getter
/******/  			});
/******/  		}
/******/  	};
/******/
/******/  	// getDefaultExport function for compatibility with non-harmony modules
/******/  	__webpack_require__.n = function(module) {
/******/  		var getter = module && module.__esModule ?
/******/  		function getDefault() { return module['default']; } :
/******/  		function getModuleExports() { return module; };
/******/  		__webpack_require__.d(getter, 'a', getter);
/******/  		return getter;
/******/  	};
/******/
/******/  	// Object.prototype.hasOwnProperty.call
/******/  	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/  	// __webpack_public_path__
/******/  	__webpack_require__.p = "/dist/";
/******/
/******/
/******/  	// Load entry module and return exports
/******/  	return __webpack_require__(0)
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {
var a=1;
var b=2;

console.log(a);

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map