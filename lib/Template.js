const Tapable = require('tapable');

class Template extends Tapable {
    constructor(props) {
        super(props);
    }

    getModulesArrayBounds(modules) {
        let minId = 0;
        let maxId = 0;
        modules.forEach(module => {
            if (minId > module.id) {
                minId = module.id;
            }
            if (maxId < module.id) {
                maxId = module.id
            }
        });

        const arrayBound = maxId;
        const objectBound = modules.map(module => {
            return (module.id + '').length + 2
        }).reduce((a, b) => a + b, -1);

        return arrayBound < objectBound ? [minId, maxId] : false;
    }
}

module.exports = Template;
