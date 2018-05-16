const fs = require('fs');
const buildDeps = require('./buildDeps');
const path = require('path');
const writeChunk = require('./writeChunk');

module.exports = function (options) {
    const {output, entry} = options;
    Object.keys(entry).forEach(entryKey => {
        const entryPath = entry[entryKey];
        const absolutePath = path.join(__dirname, entryPath);
        buildDeps(__dirname, absolutePath, options, function (err, depTree) {
            if (err) {
                console.log(err);
            } else {
                const {filename, path: outPath = process.cwd()} = output;
                try {
                    fs.statSync(outPath)
                } catch (err) {
                    fs.mkdirSync(outPath);
                }
                const source = writeChunk(depTree, absolutePath);
                const outputPath = path.resolve(outPath, filename).replace('[name]', entryKey);
                fs.writeFileSync(outputPath, source);
            }
        });
    });

}

