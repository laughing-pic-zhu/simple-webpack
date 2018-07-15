const DependenciesBlock = require('./DependenciesBlock');

class RequireEnsureDependenciesBlock extends DependenciesBlock {
    constructor(props) {
        super(props);
        this.chunkName = '';
        this.beforeRange = props.beforeRange;
        this.afterRange = props.afterRange;
    }
}

module.exports = RequireEnsureDependenciesBlock;
