const Dependency = require('./Dependency');

class MultiEntryDependency extends Dependency {
    constructor(dependencies, name) {
        super();
        this.class = MultiEntryDependency;
        this.type = 'multi entry';
        this.dependencies = dependencies;
        this.name = name;
    }

}

module.exports = MultiEntryDependency;
