const Tapable = require('tapable');
const MultiModule = require('./MultiModule');

class MultiModuleFactory extends Tapable {
    constructor(props) {
        super(props);
    }

    create(context, dependency, callback) {
        const multiModule = new MultiModule({dependencies: dependency.dependencies,context})
        callback(multiModule)
    }
}

module.exports = MultiModuleFactory;
