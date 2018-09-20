## Description

simple webpack

Features

- [x] bundle build
- [x] code-splitting
- [x] loader
- [x] plugins
- [x] source-map
    
    
## How to start

```bash
npm i 
node ./bin/webpack.js
```
## How to test
 
```bash
npm i serve -g
serve
```
    
## Usage :

	
````javascript
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
````    


  打包后

	
````javascript
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
const b = __webpack_require__(1);
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


/***/}),
/* 1 */
/***/(function(module, exports,__webpack_require__) {
const b = 'b';

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

/***/})
/***/]);

````
 

