const CommonjsRequireDependency = require('./CommonjsRequireDependency');

class AcceptImportDependency extends CommonjsRequireDependency {
    constructor(props) {
        super(props);
    }
}

AcceptImportDependency.Template = class AcceptImportDependencyTemplate {
    apply(dep, source) {
    }
}

module.exports = AcceptImportDependency;
