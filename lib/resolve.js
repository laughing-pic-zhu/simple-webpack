const fs = require('fs');
const path = require('path');
const EXTENSIONS = ['.jsx', '.js'];

/*
    文件路径增加extensions后缀匹配
 */
function loadAsFile(path, options, callback) {
    let pos = -1, result;
    const extensions = options.extensions || EXTENSIONS;

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
                loadAsDirectory(result, options, callback);
            }
        }
    }

    fs.stat(result = path, tryAgain)
}

/*
    路径返回目录时,解析package.json的main或者index.js
 */
function loadAsDirectory(dirname, options, callback) {
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
                loadAsFile(filename, options, callback)
            });
        } else {
            filename = path.join(dirname, 'index.js');
            loadAsFile(filename, options, callback);
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
function findPath(dirname, fileName, options, callback) {
    const paths = _resolveNodeModulesPaths(dirname);
    let result = path.join(paths.shift(), fileName);

    function tryPath(err, content) {
        if (err) {
            if (paths.length > 0) {
                result = path.join(paths.shift(), fileName);
                loadAsFile(result, options, tryPath);
            } else {
                callback(err);
            }
        } else {
            callback(null, content);
        }
    }

    loadAsFile(result, options, tryPath)
}

const resolve = function (dirname, fileName, options, callback) {
    const identifiersArray = fileName.split(path.sep);
    const firstChart = identifiersArray[0];
    if (firstChart === '.' || firstChart === '..' || firstChart === '') {
        if (!path.isAbsolute(fileName)) {
            fileName = path.join(dirname, fileName)
        }
        loadAsFile(fileName, options, callback);
    } else {
        findPath(dirname, fileName, options, callback);
    }
};

module.exports = resolve;
