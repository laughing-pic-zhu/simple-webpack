const fs = require('fs');
const RawSource = require('./RawSource');
const PrefixSource = require('./PrefixSource');
const ConcatSource = require('./ConcatSource');
const OriginalSource = require('./OriginalSource');
const Template = require('./Template');

class JsonMainTemplate extends Template {
    constructor(outputOptions) {
        super(outputOptions);
        this.outputOptions = outputOptions;
        this.requireFn = "__webpack_require__";
        this.plugin('local-vars', function (source) {
            return this.asString([
                source,
                '// The module cache',
                'var installedModules = {};',
            ])
        });

        this.plugin('module-obj',(source,chunk,hash,varModuleId)=>{
            return this.asString([
                'i: moduleId,',
                'l: false,',
                'exports: {},'
            ])
        })

        this.plugin('require', (source,chunk,hash) => {
            return this.asString([
                source,
                'function __webpack_require__(moduleId) {',
                this.indent([
                    'if (installedModules[moduleId]) {',
                    this.indent('return installedModules[moduleId].exports;'),
                    '}',
                    'var module = installedModules[moduleId] = {',
                    this.indent(
                        this.applyPluginsWaterfall('module-obj', '', chunk, hash, 'moduleId')
                    ),
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
                `__webpack_require__.p = "${this.outputOptions.publicPath || ''}";`,
            ])
        });


        this.plugin("require-extensions", (source, chunk, hash) => {
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
                            `script.src = __webpack_require__.p + "" + chunkId + "${this.outputOptions.fileName}";`,
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

        this.plugin('startup', (source, chunk, hash) => {
            return this.asString([
                source,
                '// Load entry module and return exports',
                `return ${this.renderRequireFunctionForModule(hash, chunk, JSON.stringify(chunk.entryModule.id))}(${this.requireFn}.s = ${JSON.stringify(chunk.entryModule.id)});`
            ])
        });

        this.plugin('render', (bootstrapSource, chunk, hash, moduleTemplate,dependencyTemplates) => {
            const source = new ConcatSource();
            source.add("/******/ (function(modules) { // webpackBootstrap\n");
            source.add(new PrefixSource("/******/", bootstrapSource,));
            source.add("/******/ })\n");
            source.add("/************************************************************************/\n");
            source.add("/******/ (");
            source.add(this.renderChunk(chunk, moduleTemplate,dependencyTemplates));
            return source
        });
    }

    getPublicPath(options) {
        return this.applyPluginsWaterfall("asset-path", this.outputOptions.publicPath || "", options);
    }

    renderRequireFunctionForModule(hash, chunk, varModuleId) {
        return this.applyPluginsWaterfall("module-require", this.requireFn, chunk, hash, varModuleId);
    }

    renderCurrentHashCode(hash, length) {
        length = length || Infinity;
        return this.applyPluginsWaterfall('current-hash', JSON.stringify(hash.substr(0, length)), length)
    }

    render(hash, chunk, moduleTemplate,outputOptions,dependencyTemplates) {
        const buf = [];
        buf.push(this.applyPluginsWaterfall('bootstrap', '', chunk, hash));
        buf.push(this.applyPluginsWaterfall('local-vars', '', chunk, hash));
        buf.push(this.applyPluginsWaterfall('require', '', chunk,hash));
        buf.push(this.applyPluginsWaterfall('require-extensions', '', chunk));
        buf.push(this.applyPluginsWaterfall('startup', '', chunk, hash));
        const source = this.applyPluginsWaterfall('render', new OriginalSource(this.prefix(buf, ' \t') + "\n", `webpack/bootstrap ${hash}`), chunk, hash, moduleTemplate,dependencyTemplates);
        return source;
    }
}


module.exports = JsonMainTemplate;
