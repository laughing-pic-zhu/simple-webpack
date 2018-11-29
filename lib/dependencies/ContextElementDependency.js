const ModuleDependency = require('./ModuleDependency')

class ContextElementDependency extends ModuleDependency {
    constructor(request) {
        super({request});
    }
}

module.exports = ContextElementDependency;
