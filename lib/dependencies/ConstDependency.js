const Dependency = require("./Dependency");
const ConstDependencyTemplate = require('./ConstDependencyTemplate');

class ConstDependency extends Dependency {
    constructor(value, range) {
        super();
        this.value = value;
        this.range = range;
    }

    updateHash(hash) {
        hash.update(this.range + "");
        hash.update(this.expression + "");
    }
}

ConstDependency.Template = ConstDependencyTemplate;

module.exports = ConstDependency;
