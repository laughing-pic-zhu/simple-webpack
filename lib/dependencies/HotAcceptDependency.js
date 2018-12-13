const HotAcceptDependencyTemplate = require('./HotAcceptDependencyTemplate');

class HotAcceptDependency {
    constructor(range, dependencies, hasCallback) {
        this.range = range;
        this.dependencies = dependencies;
        this.hasCallback = hasCallback;
    }

    updateHash() {

    }
}

HotAcceptDependency.Template = HotAcceptDependencyTemplate;

module.exports = HotAcceptDependency;
