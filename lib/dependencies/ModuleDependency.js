class ModuleDependency {
    constructor(props) {
        const {request} = props;
        this.request = request;
        this.class = ModuleDependency;
        this.module = null;
    }

    updateHash(hash) {
        if (!this.module) {
            console.log()
        }
        hash.update(this.module && this.module.id + '')
    }
}

module.exports = ModuleDependency;
