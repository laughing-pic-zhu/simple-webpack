const ModuleDependency = require('./ModuleDependency');

class SingleEntryDependency extends ModuleDependency {
    constructor(props) {
        super(props);
        this.class = SingleEntryDependency;
        this.type = 'single entry';
    }

}

module.exports = SingleEntryDependency;
