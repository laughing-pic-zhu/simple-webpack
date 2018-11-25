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
        chunk.entrypoint.push(this);
    }
}

module.exports = Entrypoint;
