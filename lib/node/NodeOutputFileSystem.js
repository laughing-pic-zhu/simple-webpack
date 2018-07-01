const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');

class NodeOutputFileSystem {
    constructor() {
        this.mkdirp = mkdirp;
        this.mkdir = fs.mkdir.bind(fs);
        this.rmdir = fs.rmdir.bind(fs);
        this.join = path.join.bind(path);
        this.writeFile = fs.writeFile.bind(fs);
    }
}

module.exports = NodeOutputFileSystem;
