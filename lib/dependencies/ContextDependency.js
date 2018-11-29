const Dependency = require('./Dependency');

class ContextDependency extends Dependency {
    constructor(request, recursive, regExp) {
        super();
        this.request = request;
        this.recursive = recursive;
        this.regExp = regExp;
    }
}

module.exports = ContextDependency;
