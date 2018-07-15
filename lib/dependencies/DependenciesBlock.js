class DependenciesBlock {
    constructor() {
        this.blocks = [];
        this.dependencies = [];
        this.requires = [];
    }

    addBlock(dependency) {
        if (this.blocks.indexOf(dependency) === -1) {
            this.blocks.push(dependency);
        }
    }

    addDependency(dependency) {
        if (this.dependencies.indexOf(dependency) === -1) {
            this.dependencies.push(dependency);
        }
    }

    addRequire(dependency) {
        if (this.requires.indexOf(dependency) === -1) {
            this.requires.push(dependency);
        }
    }
}

module.exports = DependenciesBlock;
