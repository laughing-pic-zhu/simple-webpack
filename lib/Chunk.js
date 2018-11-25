class Chunk {
    constructor(props) {
        const {name} = props;
        this.name = name;
        this.parents = [];
        this.modules = [];
        this.files = [];
        this.ids = [];
        this.entrypoint = [];
        this.id = null;
    }

    addModule(module) {
        this.modules.push(module);
    }

    setModules(modules) {
        this.modules = modules;
    }

    getChunkMaps(includeInitial, realHash) {
        const chunkHashMap = {};
        const chunkNameMap = {};
        return {
            hash: chunkHashMap,
            name: chunkNameMap
        }
    }

    addParent(parent) {
        if (this.parents.indexOf(parent) === -1) {
            this.parents.push(parent);
        }
    }

    updateHash(hash) {
        hash.update(`${this.id} `);
        hash.update(this.ids ? this.ids.join(',') : '');
        hash.update(`${this.name || ''} `);
        this.modules.forEach(m => m.updateHash(hash));
    }

}

module.exports = Chunk;
