const RequireHeaderDependencyTemplate = require('./RequireHeaderDependencyTemplate');

class RequireHeaderDependency {
    constructor(range) {
        this.range = range;
    }

    updateHash() {
    }
}

RequireHeaderDependency.Template=RequireHeaderDependencyTemplate;

module.exports = RequireHeaderDependency;
