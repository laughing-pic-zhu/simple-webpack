const fs = require('fs');
const RawSource = require('./RawSource');
const Template = require('./Template');

class JsonMainTemplate extends Template {
    constructor(props) {
        super(props);
    }

    render(chunk, options) {
        const buf = [];

        function addLine(indent, line) {
            buf.push("/******/ ");
            for (var i = 0; i < indent; i++)
                buf.push("\t");
            buf.push(line);
            buf.push("\n");
        }

        addLine(0, '(function (modules) {');
        if (chunk.blocks) {
            addLine(1, '// install a JSONP callback for chunk loading');
            addLine(1, 'var parentJsonpFunction = window["webpackJsonp"];');
            addLine(1, 'window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {');
            addLine(2, '// add "moreModules" to the modules object,');
            addLine(2, '// then flag all "chunkIds" as loaded and fire callback');
            addLine(2, 'var moduleId, chunkId, i = 0, resolves = [], result;');
            addLine(2, 'for(;i < chunkIds.length; i++) {');
            addLine(3, 'chunkId = chunkIds[i];');
            addLine(3, 'if(installedChunks[chunkId]) {');
            addLine(4, 'resolves.push(installedChunks[chunkId][0]);');
            addLine(3, '}');
            addLine(3, 'installedChunks[chunkId] = 0;');
            addLine(2, '}');
            addLine(2, 'for(moduleId in moreModules) {');
            addLine(3, 'if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {');
            addLine(4, 'modules[moduleId] = moreModules[moduleId];');
            addLine(3, '}');
            addLine(2, '}');
            addLine(2, 'if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);');
            addLine(2, 'while(resolves.length) {');
            addLine(3, 'resolves.shift()();');
            addLine(2, '}');
            addLine(1, '');
            addLine(1, '};');
        }
        addLine(1, '');
        addLine(1, '// The module cache');
        addLine(1, 'var installedModules = {};');
        addLine(1, '');
        if (chunk.blocks) {
            addLine(1, '// objects to store loaded and loading chunks');
            addLine(1, 'var installedChunks = {');
            addLine(2, `${chunk.id}: 0`);
            addLine(1, '};');
            addLine(1, '');
            addLine(1, '// The require function');
        }
        addLine(1, 'function __webpack_require__(moduleId) {');
        addLine(2, 'if (installedModules[moduleId]) {');
        addLine(3, 'return installedModules[moduleId].exports;');
        addLine(2, '}');
        addLine(2, 'var module = installedModules[moduleId] = {');
        addLine(3, 'exports: {},');
        addLine(3, 'i: moduleId,');
        addLine(3, 'l: false,');
        addLine(2, '};');
        addLine(2, 'modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);');
        addLine(2, 'module.l = true;');
        addLine(2, 'return module.exports;');
        addLine(1, '}');

        if (chunk.blocks) {
            addLine(1, '');
            addLine(1, '// This file contains only the entry chunk.');
            addLine(1, '// The chunk loading function for additional chunks');
            addLine(1, '__webpack_require__.e = function requireEnsure(chunkId) {');
            addLine(2, 'var installedChunkData = installedChunks[chunkId];');
            addLine(3, 'if(installedChunkData === 0) {');
            addLine(4, 'return new Promise(function(resolve) { resolve(); });');
            addLine(3, '}');
            addLine(2, '');
            addLine(2, '// a Promise means "currently loading".');
            addLine(2, 'if(installedChunkData) {');
            addLine(3, 'return installedChunkData[2];');
            addLine(2, '}');
            addLine(1, '');
            addLine(2, '// setup Promise in chunk cache');
            addLine(2, 'var promise = new Promise(function(resolve, reject) {');
            addLine(3, 'installedChunkData = installedChunks[chunkId] = [resolve, reject];');
            addLine(2, '});');
            addLine(2, 'installedChunkData[2] = promise;');
            addLine(2, '');
            addLine(2, '// start chunk loading');
            addLine(2, 'var head = document.getElementsByTagName(\'head\')[0];');
            addLine(2, 'var script = document.createElement(\'script\');');
            addLine(2, 'script.type = "text/javascript";');
            addLine(2, "script.async = true;");
            addLine(2, 'script.timeout = 120000;');
            addLine(2, '');
            addLine(2, 'if (__webpack_require__.nc) {');
            addLine(3, 'script.setAttribute("nonce", __webpack_require__.nc);');
            addLine(2, '}');
            addLine(2, `script.src = __webpack_require__.p + "" + chunkId + "${options.fileName}";`);
            addLine(2, 'var timeout = setTimeout(onScriptComplete, 120000);');
            addLine(2, 'script.onerror = script.onload = onScriptComplete;');
            addLine(2, 'function onScriptComplete() {');
            addLine(3, '// avoid mem leaks in IE.');
            addLine(3, 'script.onerror = script.onload = null;');
            addLine(3, 'clearTimeout(timeout);');
            addLine(3, 'var chunk = installedChunks[chunkId];');
            addLine(3, 'if(chunk !== 0) {');
            addLine(4, 'if(chunk) {');
            addLine(5, "chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));");
            addLine(4, '}');
            addLine(4, 'installedChunks[chunkId] = undefined;');
            addLine(3, '}');
            addLine(2, '};');
            addLine(2, 'head.appendChild(script);');
            addLine(2, '');
            addLine(2, 'return promise;');
            addLine(1, '};');
            addLine(2, "");
            addLine(1, "// expose the modules object (__webpack_modules__)");
            addLine(1, "__webpack_require__.m = modules;");
            addLine(1, "");
            addLine(1, "// expose the module cache");
            addLine(1, "__webpack_require__.c = installedModules;");
            addLine(1, "");
            addLine(1, "// define getter function for harmony exports");
            addLine(1, "__webpack_require__.d = function(exports, name, getter) {");
            addLine(2, "if(!__webpack_require__.o(exports, name)) {");
            addLine(3, "Object.defineProperty(exports, name, {");
            addLine(4, "configurable: false,");
            addLine(4, "enumerable: true,");
            addLine(4, "get: getter");
            addLine(3, "});");
            addLine(2, "}");
            addLine(1, "};");
            addLine(2, "");
            addLine(1, "// getDefaultExport function for compatibility with non-harmony modules");
            addLine(1, "__webpack_require__.n = function(module) {");
            addLine(2, "var getter = module && module.__esModule ?");
            addLine(2, "function getDefault() { return module['default']; } :");
            addLine(2, "function getModuleExports() { return module; };");
            addLine(2, "__webpack_require__.d(getter, 'a', getter);");
            addLine(2, "return getter;");
            addLine(1, "};");
            addLine(1, "");
            addLine(1, "// Object.prototype.hasOwnProperty.call");
            addLine(1, "__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };");
            addLine(1, "");
            addLine(1, "// __webpack_public_path__");
            addLine(1, `__webpack_require__.p = "${options.publicPath || ''}";`);
            addLine(1, "");
            addLine(1, "// on error function for async loading");
            addLine(1, "__webpack_require__.oe = function(err) { console.error(err); throw err; };");
            addLine(1, "");
            addLine(1, "// Load entry module and return exports");
        }

        addLine(1, `return __webpack_require__(${chunk.entryModule.id})`);
        addLine(0, '})')
        buf.push('/************************************************************************/\n');
        buf.push('/******/ (');
        const bounds = this.getModulesArrayBounds(chunk.modules);
        const obj = {};
        chunk.modules.forEach(module => {
            obj[module.id] = module;
        });

        if (bounds) {
            buf.push('[\n');
            const [minId, maxId] = bounds;
            const array = [];

            for (let i = minId; i <= maxId; i++) {
                array.push({
                    id: i,
                    module: obj[i]
                })
            }

            array.forEach((bound, i) => {
                if (i !== 0) {
                    buf.push(',\n');
                }
                const {id, module} = bound;
                buf.push(`/* ${id} */`);
                if (module) {
                    buf.push('\n/***/ (function(module, exports, __webpack_require__) {\n');
                    buf.push(module.source());
                    buf.push('\n/***/ })');
                }
            });
            buf.push('\n/******/ ]);');
        } else {
            buf.push('{\n');
            Object.keys(obj).forEach(id => {
                const module = obj[id];
                buf.push(`/***/${id}:`);
                buf.push('\n/***/ (function(module, exports, __webpack_require__) {\n');
                buf.push(module.source());
                buf.push('\n/***/ })');
            })
            buf.push('\n/******/ });');
        }

        return new RawSource(buf.join(''));
    }
}


module.exports = JsonMainTemplate;
