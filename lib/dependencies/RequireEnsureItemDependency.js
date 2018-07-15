const ModuleDependency = require('./ModuleDependency');

class RequireEnsureItemDependency extends ModuleDependency {
    constructor(props) {
        super(props);
        this.Class = RequireEnsureItemDependency;
    }
}

module.exports = RequireEnsureItemDependency;
