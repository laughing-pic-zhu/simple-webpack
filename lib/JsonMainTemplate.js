const fs = require('fs');
const RawSource = require('./RawSource');
const PrefixSource = require('./PrefixSource');
const ConcatSource = require('./ConcatSource');
const OriginalSource = require('./OriginalSource');
const Template = require('./Template');

class JsonMainTemplate extends Template {
    constructor(props) {
        super(props);
        this.plugin('bootstrap', (source, chunk) => {
            const jsonpFunction = 'webpackJsonp';
            // this.outputOptions.jsonpFunction;
            if (chunk.chunks.length > 1) {
                return this.asString([
                    source,
                    '// install a JSONP callback for chunk loading',
                    `var parentJsonpFunction = window[${JSON.stringify(jsonpFunction)}];`,
                    `window[${JSON.stringify(jsonpFunction)}] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {`,
                    this.indent([
                        '// add "moreModules" to the modules object,',
                        '// then flag all "chunkIds" as loaded and fire callback',
                        'var moduleId, chunkId, i = 0, resolves = [], result;',
                        'for(;i < chunkIds.length; i++) {',
                        this.indent([
                            'chunkId = chunkIds[i];',
                            'resolves.push(installedChunks[chunkId][0]);'
                        ]),
                        '}',
                        'installedChunks[chunkId] = 0;',
                        'for(moduleId in moreModules) {',
                        this.indent([
                            'if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {',
                            this.indent('modules[moduleId] = moreModules[moduleId];'),
                            '}',
                        ]),
                        '}',
                        'if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);',
                        'while(resolves.length) {',
                        this.indent('resolves.shift()();'),
                        '}',
                    ]),
                    '};',
                ]);
            }
            return source
        });

        this.plugin('local-vars', function (source) {
            return this.asString([
                source,
                '// The module cache',
                'var installedModules = {};',
            ])
        });

        this.plugin("local-vars", function (source, chunk) {
            if (chunk.chunks.length > 1) {
                return this.asString([
                    source,
                    "// objects to store loaded and loading chunks",
                    "var installedChunks = {",
                    this.indent(`${chunk.id}: 0\n`,),
                    "};"
                ]);
            }
            return source;
        });

        this.plugin('require', (source, options) => {
            return this.asString([
                source,
                'function __webpack_require__(moduleId) {',
                this.indent([
                    'if (installedModules[moduleId]) {',
                    this.indent('return installedModules[moduleId].exports;'),
                    '}',
                    'var module = installedModules[moduleId] = {',
                    this.indent(['exports: {},', 'i: moduleId,', 'l: false,']),
                    '};',
                    'modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);',
                    'module.l = true;',
                    'return module.exports;',
                ]),
                '}',
                "",
                "// expose the modules object (__webpack_modules__)",
                "__webpack_require__.m = modules;",
                "",
                "// expose the module cache",
                "__webpack_require__.c = installedModules;",
                "",
                "// define getter function for harmony exports",
                "__webpack_require__.d = function(exports, name, getter) {",
                this.indent([
                    "if(!__webpack_require__.o(exports, name)) {",
                    this.indent([
                        "Object.defineProperty(exports, name, {",
                        this.indent([
                            "configurable: false,",
                            "enumerable: true,",
                            "get: getter"
                        ]),
                        "});"
                    ]),
                    "}"
                ]),
                "};",
                "",
                "// getDefaultExport function for compatibility with non-harmony modules",
                "__webpack_require__.n = function(module) {",
                this.indent([
                    "var getter = module && module.__esModule ?",
                    "function getDefault() { return module['default']; } :",
                    "function getModuleExports() { return module; };",
                    "__webpack_require__.d(getter, 'a', getter);",
                    "return getter;"
                ]),
                "};",
                "",
                "// Object.prototype.hasOwnProperty.call",
                "__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };",
                "",
                "// __webpack_public_path__",
                `__webpack_require__.p = "${options.publicPath || ''}";`,
            ])
        });


        this.plugin("require-extensions", (source, chunk, options) => {
            if (chunk.chunks.length > 1) {
                return this.asString(
                    [
                        source,
                        '// This file contains only the entry chunk.',
                        '// The chunk loading function for additional chunks',
                        '__webpack_require__.e = function requireEnsure(chunkId) {',
                        this.indent([
                            'var installedChunkData = installedChunks[chunkId];',
                            this.indent([
                                'if(installedChunkData === 0) {',
                                this.indent('return new Promise(function(resolve) { resolve(); });'),
                                '}'
                            ]),
                            '',
                            '// a Promise means "currently loading".',
                            'if(installedChunkData) {',
                            this.indent('return installedChunkData[2];'),
                            '}',
                            '',
                            '// setup Promise in chunk cache',
                            'var promise = new Promise(function(resolve, reject) {',
                            this.indent([
                                'installedChunkData = installedChunks[chunkId] = [resolve, reject];'
                            ]),
                            '});',
                            'installedChunkData[2] = promise;',
                            '',
                            '// start chunk loading',
                            'var head = document.getElementsByTagName("head")[0];',
                            'var script = document.createElement("script");',
                            'script.type = "text/javascript";',
                            "script.async = true;",
                            'script.timeout = 120000;',
                            '',
                            'if (__webpack_require__.nc) {',
                            this.indent('script.setAttribute("nonce", __webpack_require__.nc);'),
                            '}',
                            `script.src = __webpack_require__.p + "" + chunkId + "${options.fileName}";`,
                            'var timeout = setTimeout(onScriptComplete, 120000);',
                            'script.onerror = script.onload = onScriptComplete;',
                            'function onScriptComplete() {',
                            this.indent([
                                '// avoid mem leaks in IE.',
                                'script.onerror = script.onload = null;',
                                'clearTimeout(timeout);',
                                'var chunk = installedChunks[chunkId];',
                                'if(chunk !== 0) {',
                                this.indent([
                                    'if(chunk) {',
                                    this.indent("chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));"),
                                    '}',
                                    'installedChunks[chunkId] = undefined;',
                                ]),
                                "}",
                            ]),
                            "}",
                            "head.appendChild(script);",
                            "",
                            'return promise;',
                        ]),
                        '};',
                        "// on error function for async loading",
                        "__webpack_require__.oe = function(err) { console.error(err); throw err; };",
                    ]
                )
            }
            return source;
        });

        this.plugin('startup', (source, chunk) => {
            return this.asString([
                source,
                '// Load entry module and return exports',
                `return __webpack_require__(${chunk.entryModule.id})`
            ])
        });

        this.plugin('render', (bootstrapSource, chunk, moduleTemplate) => {
            const source = new ConcatSource();
            source.add("/******/ (function(modules) { // webpackBootstrap\n");
            source.add(new PrefixSource("/******/", bootstrapSource,));
            source.add("/******/ })\n");
            source.add("/************************************************************************/\n");
            source.add("/******/ (");
            source.add(this.renderChunk(chunk,moduleTemplate));
            return source
        });
    }

    render(chunk, moduleTemplate, options) {
        const buf = [];
        buf.push(this.applyPluginsWaterfall('bootstrap', '', chunk));
        buf.push(this.applyPluginsWaterfall('local-vars', '', chunk));
        buf.push(this.applyPluginsWaterfall('require', '', options));
        buf.push(this.applyPluginsWaterfall('require-extensions', '', chunk, options));
        buf.push(this.applyPluginsWaterfall('startup', '', chunk));
        const source = this.applyPluginsWaterfall('render', new OriginalSource(this.prefix(buf, ' \t') + "\n", 'webpack/bootstrap'), chunk, moduleTemplate);
        return source;
    }
}


module.exports = JsonMainTemplate;
