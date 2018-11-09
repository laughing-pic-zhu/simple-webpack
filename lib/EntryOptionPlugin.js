const SingleEntryPlugin = require('./SingleEntryPlugin');
const MultiEntryPlugin = require('./MultiEntryPlugin');

function itemToPlugin(context, entry, name) {
    if (Array.isArray(entry)) {
        return new MultiEntryPlugin({context, name, dependencies:entry})
    }
    return new SingleEntryPlugin({context, name, entry})
}

function EntryOptionPlugin() {

}

EntryOptionPlugin.prototype.apply = function (compiler) {
    compiler.plugin("entry-option", function (context, entry) {
        if (typeof entry === 'string') {
            compiler.apply(itemToPlugin(context, entry, 'main'))
        } else if (typeof entry === 'object') {
            Object.keys(entry).forEach(name => {
                const entryPath = entry[name];
                compiler.apply(itemToPlugin(context, entryPath, name))
            });
        }
    })
};


module.exports = EntryOptionPlugin;
