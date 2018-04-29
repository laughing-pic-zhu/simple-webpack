const fs = require('fs');
const buildDeps = require('./buildDeps');
const path = require('path');
const writeSource = require('./writeSource');

module.exports = function (options) {
    const {output, entry} = options;
    buildDeps(__dirname, entry, options, function (err, depTree) {
        if (err) {
            console.log(err);
        } else {
            const entryPath = path.join(__dirname, entry);
            const source = writeSource(depTree, entryPath);

            console.log(source);
            fs.writeFileSync(output, source);
        }
    });
}

