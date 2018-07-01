class Chunk {
    constructor(props) {
        const {name} = props;
        this.name = name;
        this.parents = [];
        this.modules = [];
        this.id = null;
    }

    addModule(module) {
        this.modules.push(module);
    }

    removeModule() {

    }

    addParent() {

    }

    removeParent() {

    }
}

module.exports = Chunk;
