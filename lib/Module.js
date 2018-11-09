const DependenciesBlock = require('./dependencies/DependenciesBlock');
const path = require('path');

class Module extends DependenciesBlock {
    constructor(props) {
        super(props);
        const {context} = props;
        this.chunks = [];
        this.context = context;
        this.id = null;

    }

    identifier() {
        return this.request;
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

    updateHash(hash) {
        hash.update(`${this.id} `);
        super.updateHash(hash);
    }
}

module.exports = Module;
