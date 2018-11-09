const nodeLibsBrowser = require('node-libs-browser');
const AliasPlugin = require("enhanced-resolve/lib/AliasPlugin");

/*
    resolve native node module
 */

class NodeSourcePlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.plugin('after-resolvers', () => {
            Object.keys(nodeLibsBrowser).forEach(lib => {
                if (this.options[lib] !== false) {
                    compiler.resolver.normal.apply(
                        new AliasPlugin("described-resolve", {
                            name: lib,
                            onlyModule: true,
                            alias: nodeLibsBrowser[lib]
                        }, "resolve")
                    );
                }
            })
        })
    }
}

module.exports = NodeSourcePlugin;
