const resolve = require('./resolve');
const parse = require('./parse');
const fs = require('fs');
const path = require('path');

function buildDeps(dirname, fileName, options, callback) {
    const depTree = {
        modules: {},
        nextModuleId: 0,
        mapNameToId: {},
    };

    addModule(depTree, dirname, fileName, options, function (err, moduleId) {
        if (err) {
            callback(err);
        } else {
            console.log(depTree)

            callback(null, depTree);
        }
    });
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
                            rangeRequires: []
                        };
                        parse(context, source);
                        const {requires, rangeRequires} = context;
                        const id = depTree.nextModuleId++;
                        depTree.mapNameToId[filename] = id;
                        depTree.modules[filename] = {
                            filename,
                            id,
                            requires,
                            rangeRequires,
                            source,
                        };
                        let len = requires.length;
                        dirname = path.dirname(path.join(dirname, fileName));
                        if (len > 0) {
                            requires.forEach(req => {
                                const {name} = req;
                                addModule(depTree, dirname, name, options, function (err, moduleId) {
                                    req.id = moduleId;
                                    --len;
                                    if (len <= 0) {
                                        callback(null, moduleId);
                                    }

                                })
                            })
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


module.exports = buildDeps;
