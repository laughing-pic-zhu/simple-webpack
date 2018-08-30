class Chunk {
    constructor(props) {
        const {name} = props;
        this.name = name;
        this.parents = [];
        this.modules = [];
        this.files = [];
        this.id = null;
    }

    addModule(module) {
        this.modules.push(module);
    }

    removeModule() {

    }

    addParent(parent) {
        if (this.parents.indexOf(parent) === -1) {
            this.parents.push(parent);
        }
    }

}

module.exports = Chunk;
