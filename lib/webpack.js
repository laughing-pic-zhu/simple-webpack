const fs = require('fs');
const buildDeps = require('./buildDeps');
const path = require('path');
const writeChunk = require('./writeChunk');
const templateSingle = fs.readFileSync(path.join(__dirname, './templateSingle.js'));
const templateAsync = fs.readFileSync(path.join(__dirname, './templateAsync.js'));

module.exports = function (options) {
    const {output, entry} = options;
    Object.keys(entry).forEach(entryKey => {
        const entryPath = entry[entryKey];
        const absolutePath = path.join(__dirname, entryPath);
        buildDeps(__dirname, absolutePath, options, function (err, depTree) {
            if (err) {
                console.error(err);
            } else {
                const {filename, path: outPath = process.cwd()} = output;
                try {
                    fs.statSync(outPath)
                } catch (err) {
                    fs.mkdirSync(outPath);
                }

                const chunks = depTree.chunks;
                Object.keys(chunks).forEach(key => {
                    const buffer = [];
                    const chunk = chunks[key];
                    const chunkId = chunk.id;
                    if (chunkId === 0) {
                        if (Object.keys(chunks).length > 1) {
                            buffer.push(templateAsync.toString());
                            buffer.push('/******/([\n');
                        } else {
                            buffer.push(templateSingle.toString());
                            buffer.push('/******/([\n');
                        }
                    } else {
                        buffer.push(`webpackJsonp([${chunkId}],[\n`);
                    }
                    buffer.push(writeChunk(depTree, chunk));
                    const source = buffer.join('');
                    const outputPath = path.resolve(outPath, filename).replace('[name]', chunk.id);
                    fs.writeFileSync(outputPath, source);
                });

            }
        });
    });
}

