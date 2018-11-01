const Template = require('./Template');

class HotModuleReplacementPlugin {
    constructor(options) {
        this.options = options || {};
        this.requestTimeout = this.options.requestTimeout || 10000;
    }

    apply(compiler) {
        const requestTimeout = this.requestTimeout;
        compiler.plugin('compilation', (compilation, params) => {

            compilation.mainTemplate.plugin('bootstrap', function (source, chunk, hash) {
                source = this.applyPluginsWaterfall("hot-bootstrap", source, chunk, hash);
                return this.asString([
                    source,
                    "",
                    hotInitCode
                        .replace(/\$require\$/g, this.requireFn)
                        .replace(/\$hash\$/g, JSON.stringify(hash))
                        .replace(/\$requestTimeout\$/g, requestTimeout)
                ])
            });

            compilation.mainTemplate.plugin('module-require', (_, chunk, hash, varModuleId) => {
                return `hotCreateRequire(${varModuleId})`
            });

            compilation.mainTemplate.plugin('require-extensions', function (source) {
                const buf = [source];
                buf.push("// __webpack_hash__");
                buf.push(`${this.requireFn}.h = function() { return hotCurrentHash; };`)
                return this.asString(buf);
            });

            compilation.mainTemplate.plugin('current-hash', () => {
                return "hotCurrentHash";
            });
        })
    }
}

const hotInitCode = Template.getFunctionContent(require('./HotModuleReplacement.runtime'));

module.exports = HotModuleReplacementPlugin;
