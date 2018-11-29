const ContextDependency = require('./ContextDependency');

class RequireContextDependency extends ContextDependency {
    constructor(request, recursive, regExp, range) {
        super(request, recursive, regExp);
        this.range = range;
        this.class = RequireContextDependency;
    }
}

module.exports = RequireContextDependency;
