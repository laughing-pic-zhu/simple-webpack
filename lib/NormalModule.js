const Module = require('./Module');
const fs = require('fs');
const {runLoaders, getLoaderFunctions} = require('./utils/runLoaders');

class NormalModule extends Module {
    constructor(props) {
        super(props);
        const {parser, request, loaders, fileName} = props;
        this.parser = parser;
        this.fileDependencies = [];
        this.loaders = loaders;
        this.request = request;
        this.fileName = fileName;
        this.built = false;
    }

    addDependency(dependency) {
        if (this.fileDependencies.indexOf(dependency) === -1) {
            this.fileDependencies.push(dependency);
        }
    }

    removeDenpendency(dependency) {
        const ids = this.fileDependencies.indexOf(dependency);
        if (ids >= 0) {
            this.fileDependencies.splice(ids, 1);
        }
    }

    doBuild(callback) {
        this.built = true;
        const {request, loaders, fileName} = this;
        runLoaders({
            request,
            loaders,
            loadersFunction: [],
            fileName,
            fs,
        }, (err, source) => {
            if (!err) {
                this.parser.parse(source, {
                    current: this,
                    module: this
                });
                
                callback();
            }
        })
    }
}

module.exports = NormalModule;
