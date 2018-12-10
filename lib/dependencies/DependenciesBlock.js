class DependenciesBlock {
    constructor() {
        this.blocks = [];
        this.dependencies = [];
        this.requires = [];
    }

    addBlock(block) {
        if (this.blocks.indexOf(block) === -1) {
            this.blocks.push(block);
        }
    }

    addDependency(dependency) {
        if (this.dependencies.indexOf(dependency) === -1) {
            this.dependencies.push(dependency);
        }
    }

    addRequire(req) {
        if (this.requires.indexOf(req) === -1) {
            this.requires.push(req);
        }
    }

    updateHash(hash) {
        function updateHash(i) {
            if(i.updateHash===undefined){
                console.log()
            }
            i.updateHash(hash);
        }
        this.dependencies.forEach(updateHash);
        this.blocks.forEach(updateHash);
    }
}

module.exports = DependenciesBlock;
