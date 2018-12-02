const CommonjsRequireDependency = require('./CommonjsRequireDependency')

class ContextElementDependency extends CommonjsRequireDependency {
    constructor(request) {
        super({request});
    }
}

module.exports = ContextElementDependency;
