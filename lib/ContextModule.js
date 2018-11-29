const Module = require('./Module');

class ContextModule extends Module {
    constructor(props) {
        super(props);
        const {parser, request, resolveDependencies, context, recursive, regExp, loaders, rawRequest, fileName} = props;
        this.parser = parser;
        this.resolveDependencies = resolveDependencies;
        this.recursive = recursive;
        this.regExp = regExp;
        this.loaders = loaders;
        this.rawRequest = rawRequest;
        this.fileName = fileName;
        this.context = context;
        this.request = request;
    }

    identifier() {
        let identifier = this.context;
        if (!this.recursive)
            identifier += " nonrecursive";
        if (this.regExp)
            identifier += ` ${this.regExp}`;

        return identifier;
    }

    doBuild(fs, callback) {
        const {request, recursive, regExp, resolveDependencies} = this;
        resolveDependencies(fs, request, recursive, regExp, (err, dependencies) => {
            console.log(dependencies)
        });
    }

    source() {

    }
}

module.exports = ContextModule;
