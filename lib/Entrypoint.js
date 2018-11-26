/**
 * entry chunk information
 */
class Entrypoint {
    constructor(name) {
        this.name = name;
        this.chunks = [];
    }

    unshiftChunk(chunk) {
        this.chunks.unshift(chunk);
        chunk.entrypoints.push(this);
    }
}

module.exports = Entrypoint;
