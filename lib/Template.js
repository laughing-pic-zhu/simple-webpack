const Tapable = require('tapable');

class Template extends Tapable {
    constructor(props) {
        super(props);
    }

    getModulesArrayBounds(modules) {
        const mixId = 0;
        const module = modules[modules.length - 1];
        const obj = {};
        modules.forEach(module => {
            obj[module.id] = module;
        });

        const maxId = module.id;
        const array = [];
        for (let i = mixId; i <= maxId; i++) {
            array.push({
                id: i,
                module: obj[i]
            })
        }
        return array;
    }
}

module.exports = Template;
