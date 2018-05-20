const resolve = require('./resolve');
const parse = require('./parse');
const fs = require('fs');
const path = require('path');

function buildDeps(dirname, fileName, options, callback) {
    const depTree = {
        modules: {},
        nextModuleId: 0,
        mapIdToName: {},
        modulesArray: [],
        chunks: {},
        nextChunkId: 0,
    };
    addModule(depTree, dirname, fileName, options, function (err, moduleId) {
        if (err) {
            console.error('err')
            callback(err);
        } else {
            sortModules(depTree);
            buildTree(depTree, fileName, callback);
        }
    });
}

function buildTree(depTree, mainPath, callback) {
    addChunk(depTree, mainPath);
    removeParentModules(depTree.chunks);
    callback(null, depTree);
}

function addModule(depTree, dirname, fileName, options, callback) {

    resolve(dirname, fileName, options, function (err, filename) {
        if (!err) {
            if (depTree.modules[filename]) {
                callback(null, depTree.modules[filename].id);
            } else {
                const id = depTree.nextModuleId++;
                depTree.mapIdToName[id] = filename;
                depTree.modules[filename] = {
                    filename,
                    id,
                };
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
                                        callback(null, id);
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

function sortModules(depTree) {
    const {modules} = depTree;
    depTree.modulesArray = Object.keys(modules).sort((a, b) => {
        return modules[a].id - modules[b].id
    })
}

function addChunk(depTree, mainPath) {
    const {chunks, modules, mapIdToName} = depTree;
    const mainModule = modules[mainPath];
    const chunk = {
        id: depTree.nextChunkId++,
        modules: {},
    };
    chunks[chunk.id] = chunk;
    addModuleToChunk(depTree, chunk, mainModule);
}

function addModuleToChunk(depTree, chunk, module) {
    const {modules, mapIdToName} = depTree;
    chunk.modules[module.id] = 'include';
    module.requires.forEach(req => {
        const {id} = req;
        const mod = modules[mapIdToName[id]];
        addModuleToChunk(depTree, chunk, mod);
    });
    module.asyncs.forEach(async => {
        createChunk(depTree, async, chunk.id)
    });
}

function createChunk(depTree, async, parentId) {
    const requires = async.requires;
    const {chunks, modules, mapIdToName} = depTree;
    async.chunkId = depTree.nextChunkId;
    const chunk = {
        id: depTree.nextChunkId++,
        modules: {},
        parentId
    };
    chunks[chunk.id] = chunk;

    requires.forEach(req => {
        const {id} = req;

        addModuleToChunk(depTree, chunk, modules[mapIdToName[id]]);
    })
}

function removeParentModules(chunks) {
    Object.keys(chunks).forEach(key => {
        const chunk = chunks[key];
        if (chunk.parentId !== undefined) {
            const modules = chunk.modules;
            Object.keys(modules).forEach(k => {
                if (chunks[chunk.parentId].modules[k]) {
                    modules[k] = 'in-parent';
                }
            })
        }

    });
}

module.exports = buildDeps;
