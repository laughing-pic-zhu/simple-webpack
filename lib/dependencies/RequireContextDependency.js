const ContextDependency = require('./ContextDependency');
const ModuleDependencyTemplateAsId = require('./ModuleDependencyTemplateAsId');

class RequireContextDependency extends ContextDependency {
    constructor(request, recursive, regExp, range) {
        super(request, recursive, regExp);
        this.range = range;
        this.class = RequireContextDependency;
    }

    updateHash(hash) {
        const {request, recursive, regExp} = this;
        hash.update(request + recursive + regExp)
    }
}

RequireContextDependency.Template = ModuleDependencyTemplateAsId;

module.exports = RequireContextDependency;
