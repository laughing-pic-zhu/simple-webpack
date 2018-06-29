class ModuleDependency {
    constructor(props) {
        const {range, request} = props;
        this.request = request;
        this.range = range;
    }
}

module.exports = ModuleDependency;
