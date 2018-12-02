const ModuleDependency = require('./ModuleDependency');
const ModuleDependencyTemplateAsId = require('./ModuleDependencyTemplateAsId');

class CommonjsRequireDependency extends ModuleDependency {
    constructor(props) {
        const {range} = props;
        super(props);
        this.range = range;
        this.class = CommonjsRequireDependency;
    }

    get type() {
        return "cjs require";
    }
}

CommonjsRequireDependency.Template = ModuleDependencyTemplateAsId;
module.exports = CommonjsRequireDependency;
