const resolve = require('./resolve');
const parse = require('./parse');
const fs = require('fs');
const path = require('path');

function buildDeps(dirname, fileName, options, callback) {
    const depTree = {
        modules: {},
        nextModuleId: 0,
        mapIdToName: {},
        chunks: {},
        nextChunkId: 0,
    };
    addModule(depTree, dirname, fileName, options, function (err, moduleId) {
        if (err) {
            console.error('err')
            callback(err);
        } else {
            buildTree(depTree, fileName, callback);
        }
    });
}

function buildTree(depTree, mainPath, callback) {
    addChunk(depTree, mainPath);
    callback(null, depTree);
}

function addModule(depTree, dirname, fileName, options, callback) {
    resolve(dirname, fileName, options, function (err, filename) {
        if (!err) {
            if (depTree.modules[filename]) {
                callback(null, depTree.modules[filename].id);
            } else {
                fs.readFile(filename, function (err, content) {
                    if (!err) {
                        const source = content.toString();
                        const context = {
                            requires: [],
                            asyncs: [],
                            rangeRequires: []
                        };
                        let totalRequires = [];
                        parse(context, source);
                        const {requires, rangeRequires, asyncs} = context;
                        const id = depTree.nextModuleId++;
                        depTree.mapIdToName[id] = filename;
                        depTree.modules[filename] = {
                            filename,
                            id,
                            requires,
                            rangeRequires,
                            asyncs,
                            source,
                        };
                        asyncs.forEach(async => {
                            const {requires} = async;
                            requires.forEach(req => {
                                totalRequires.push(req)
                            })
                        });
                        totalRequires = requires.concat(totalRequires);
                        let len = totalRequires.length;
                        dirname = path.dirname(path.resolve(dirname, fileName));
                        if (len > 0) {
                            totalRequires.forEach(req => {
                                const {name} = req;
                                addModule(depTree, dirname, name, options, function (err, moduleId) {
                                    req.id = moduleId;
                                    --len;
                                    if (len <= 0) {
                                        callback(null, moduleId);
                                    }

                                })
                            });
                        } else {
                            callback(null, id);
                        }
                    } else {
                        callback(err);
                    }
                })
            }
        } else {
            callback(err);
        }
    })
}

function addChunk(depTree, mainPath) {
    const {chunks, modules, mapIdToName} = depTree;
    const mainModule = modules[mainPath];
    const chunk = {
        id: depTree.nextChunkId++,
        modules: [],
    };
    chunks[chunk.id] = chunk;
    addModuleToChunk(depTree, chunk, mainModule,3);
    console.log(depTree.chunks)
}

function addModuleToChunk(depTree, chunk, module,aaa) {
    const {modules, mapIdToName} = depTree;
    chunk.modules.push(module);
    module.requires.forEach(req => {
        const {id} = req;
        const mod = modules[mapIdToName[id]];
        addModuleToChunk(depTree, chunk, mod);
    });

    module.asyncs.forEach(async => {
        const requires = async.requires;
        createChunk(depTree, requires, chunk.id)
    });
}

function createChunk(depTree, requires, parentId) {
    const {chunks, modules, mapIdToName} = depTree;
    const chunk = {
        id: depTree.nextChunkId++,
        modules: [],
        parentId
    };
    chunks[chunk.id] = chunk;
    requires.forEach(req => {
        const {id} = req;
        addModuleToChunk(depTree, chunk, modules[mapIdToName[id]]);
    })
}

module.exports = buildDeps;
