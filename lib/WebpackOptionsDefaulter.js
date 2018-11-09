class WebpackOptionsDefaulter {
    constructor() {

        this.config = {};
        this.defaults = {};

        this.set('devtool', false);
        this.set('context', process.cwd());
        this.set('module', 'call', value => Object.assign({}, value));
        this.set('module.rules', []);
        this.set('resolve', 'call', value => Object.assign({}, value));
        this.set('resolve.unsafeCache', true);
        this.set('resolve.cacheWithContext', false);
        this.set('resolve.cacheWithContext', false);
        this.set('resolve.modules', ["node_modules"]);
        this.set('resolve.extensions', [".js", ".json"]);
        this.set('resolve.mainFiles', ["index"]);
        this.set('resolve.mainFields', ["browser", "module", "main"]);
        this.set('resolve.aliasFields', ["browser"]);
        this.set('resolveLoader', 'call', value => Object.assign({}, value));
        this.set('resolveLoader.cacheWithContext', false);
        this.set('resolveLoader.unsafeCache', true);
        this.set('resolveLoader.mainFields', ["loader", "main"]);
        this.set('resolveLoader.extensions', [".js", ".json"]);
        this.set('resolveLoader.mainFiles', ["index"]);
        this.set('output', 'call', value => {
            if (typeof value === 'string') {
                return {
                    filename: value
                }
            } else {
                return Object.assign({}, value)
            }
        });
        this.set('output.filename', '[name].js');
        this.set('output.chunkFilename', '');
        this.set('output.jsonpFunction', 'webpackJsonp');
        this.set('output.sourceMapFilename', '[file].map[query]');
        this.set('output.publicPath', '/');
        this.set("output.path", process.cwd());
        this.set('output.hashFunction', 'md5');
        this.set('output.hashDigest', 'hex');
        this.set('output.hotUpdateChunkFilename', '[id].[hash].hot-update.js');
        this.set('output.hotUpdateMainFilename', '[hash].hot-update.json');
        this.set('output.hotUpdateFunction', 'webpackHotUpdate');
        this.set("node", "call", value => {
            if(typeof value === "boolean") {
                return value;
            } else {
                return Object.assign({}, value);
            }
        });
        this.set("node.console", false);
    }

    setProperty(obj, name, value) {
        name = name.split('.');
        for (let i = 0; i < name.length - 1; i++) {
            if (!obj[name[i]]) {
                obj[name[i]] = {};
            }
            obj = obj[name[i]];
        }
        obj[name.pop()] = value;
    }

    getProperty(obj, name) {
        name = name.split('.');
        for (let i = 0; i < name.length - 1; i++) {
            obj = obj[name[i]];
            if (typeof obj !== 'object') {
                return
            }
        }
        return obj[name.pop()];
    }

    process(options) {
        options = Object.assign({}, options);
        for (let name in this.defaults) {
            const config = this.config[name];
            switch (config) {
                case undefined:
                    if (this.getProperty(options, name) === undefined) {
                        this.setProperty(options, name, this.defaults[name]);
                    }
                    break;
                case 'call':
                    this.setProperty(options, name, this.defaults[name].call(this, this.getProperty(options, name)))
                    break;
                default:
                    throw new Error('OptionsDefaulter error')
            }
        }

        return options
    }

    set(name, config, def) {
        if (arguments.length === 3) {
            this.config[name] = config;
            this.defaults[name] = def;
        } else {
            this.defaults[name] = config;
        }
    }
}

module.exports = WebpackOptionsDefaulter;
