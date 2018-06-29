class AbstractPlugin {
    constructor(props) {
        this._plugins = props || {};
    }

    apply(scope) {
        Object.keys(this._plugins).forEach(key => {
            scope.plugin(key, this._plugins[key]);
        })
    }
}

module.exports = AbstractPlugin;
