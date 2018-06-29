class Module {
    constructor() {
        this.chunks = [];
        this.id = null;
    }

    addChunk(chunk) {
        if (this.chunks.indexOf(chunk) === -1) {
            this.chunks.push(chunk);
        }
    }

    removeChunk(chunk) {
        const index = this.chunks.indexOf(chunk);
        if (index > -1) {
            this.chunks.splice(index, 1);
        }
    }
}

module.exports = Module;
