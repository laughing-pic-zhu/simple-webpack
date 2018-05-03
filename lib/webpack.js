const fs = require('fs');
const buildDeps = require('./buildDeps');
const path = require('path');
const writeChunk = require('./writeChunk');

module.exports = function (options) {
    const {output, entry} = options;
    buildDeps(__dirname, entry, options, function (err, depTree) {
        if (err) {
            console.log(err);
        } else {
            const entryPath = path.join(__dirname, entry);
            const source = writeChunk(depTree, entryPath);

            fs.writeFileSync(output, source);
        }
    });
}

