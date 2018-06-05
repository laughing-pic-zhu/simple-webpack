const fs = require('fs');
const path = require('path');
const EXTENSIONS = ['.jsx', '.js'];
const LOADEREXTENSIONS = [".loader.js", "", ".js"];


/*
    文件路径增加extensions后缀匹配
 */
function loadAsFile(path, options, type, callback) {
    let pos = -1, result;
    let extensions;
    if (type === 'loader') {
        extensions = options.loaderExtensions || LOADEREXTENSIONS;
    } else {
        extensions = options.extensions || EXTENSIONS;
    }

    function tryAgain(err, stats) {
        if (err) {
            pos++;
            if (pos >= extensions.length) {
                callback(err);
                return;
            }
            const extension = extensions[pos];
            result = path + extension;
            fs.stat(result, tryAgain);
        } else {
            if (stats.isFile()) {
                callback(null, result);
            } else if (stats.isDirectory()) {
                loadAsDirectory(result, options, type, callback);
            }
        }
    }

    fs.stat(result = path, tryAgain)
}

/*
    路径返回目录时,解析package.json的main或者index.js
 */
function loadAsDirectory(dirname, options, type, callback) {
    let filename = path.join(dirname, 'package.json');
    fs.stat(filename, function (err, stat) {
        if (!err && stat.isFile()) {
            fs.readFile(filename, function (err, data) {
                const content = JSON.parse(data);
                if (content.main) {
                    filename = path.join(dirname, content.main);
                } else {
                    filename = path.join(dirname, 'index.js');
                }
                loadAsFile(filename, options, type, callback)
            });
        } else {

            filename = path.join(dirname, 'index.js');
            loadAsFile(filename, options, type, callback);
        }
    })
}

/*
    路径返回中间路径数组
 */
function _resolveNodeModulesPaths(from) {
    from = path.resolve(from);
    const array = from.split(path.sep);
    const nodeModules = [];
    for (let i = array.length; i > 0; i--) {
        const temp = array.slice(0, i);
        temp.push('node_modules');
        nodeModules.push(temp.join('/'));
    }
    return nodeModules;
}

/*
    解析路径数组中文件,得出最终路径
 */
function findPath(dirname, fileName, options, type, callback) {
    const paths = _resolveNodeModulesPaths(dirname);
    let result = path.join(paths.shift(), fileName);

    function tryPath(err, content) {
        if (err) {
            if (paths.length > 0) {
                result = path.join(paths.shift(), fileName);
                loadAsFile(result, options, type, tryPath);
            } else {
                callback(err);
            }
        } else {
            callback(null, content);
        }
    }

    loadAsFile(result, options, type, tryPath)
}

const resolve = function (dirname, fileName, options, type, callback) {
    const identifiersArray = fileName.split(path.sep);
    const firstChart = identifiersArray[0];
    if (firstChart === '.' || firstChart === '..' || firstChart === '') {
        if (!path.isAbsolute(fileName)) {
            fileName = path.join(dirname, fileName)
        }
        loadAsFile(fileName, options, type, callback);
    } else {
        findPath(dirname, fileName, options, type, callback);
    }
};

const doResolve = function (dirname, fileName, options, callback) {
    let identifiers = fileName.split('!');
    const realFileName = identifiers.pop();
    const errors = [];
    let count = 0;
    let len = 0;
    resolve(dirname, realFileName, options, 'normal', function (err, absoluteFileName) {
        if (err) {
            callback(err);
        } else {
            options.loaders.forEach(line => {
                const {loader, test} = line;
                if (test.test(absoluteFileName)) {
                    const loaderArray = loader.split('!');
                    identifiers = identifiers.concat(loaderArray)
                }
            });
            identifiers.push(absoluteFileName);
            len = identifiers.length;

            if (len > 0) {
                identifiers.forEach((identifier, i) => {
                    const type = len !== (i + 1) ? 'loader' : 'normal';
                    resolve(dirname, identifier, options, type, function (err, absoluteFileName) {
                        if (err) {
                            errors.push(err);
                        } else {
                            identifiers[i] = absoluteFileName;
                            endOne();
                        }
                    });
                })
            }
        }
    });

    function endOne() {
        count++;
        if (count === len) {
            if (errors.length > 0) {
                callback(errors.join('\n'));
            } else {
                callback(null, identifiers.join('!'));
            }
        }
    }

};

module.exports = doResolve;
