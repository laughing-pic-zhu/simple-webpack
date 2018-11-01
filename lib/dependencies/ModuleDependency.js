class ModuleDependency {
    constructor(props) {
        const {range, request} = props;
        this.request = request;
        this.range = range;
        this.class = ModuleDependency;
        this.type = 'cms require';
        this.module = null;
    }

    updateHash(hash) {
        hash.update(this.module && this.module.id + '')
    }
}

module.exports = ModuleDependency;
