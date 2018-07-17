class ModuleDependency {
    constructor(props) {
        const {range, request} = props;
        this.request = request;
        this.range = range;
        this.class = ModuleDependency;
        this.type = 'cms require';
    }
}

module.exports = ModuleDependency;
