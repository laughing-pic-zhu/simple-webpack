class Dependency {
    constructor() {
        this.module = null;
    }

    addModule(module) {
        this.module = module;
    }
}

module.exports = Dependency
