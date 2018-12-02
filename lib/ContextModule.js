const Module = require('./Module');
const ReplaceSource = require('./ReplaceSource');
const OriginalSource = require('./OriginalSource');
const CachedSource=require('./CachedSource');

class ContextModule extends Module {
    constructor(props) {
        super(props);
        const {parser, request, resolveDependencies, recursive, regExp, loaders, rawRequest, fileName} = props;
        this.parser = parser;
        this.resolveDependencies = resolveDependencies;
        this.recursive = recursive;
        this.regExp = regExp;
        this.loaders = loaders;
        this.rawRequest = rawRequest;
        this.fileName = fileName;
        this.context = request;
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

    doBuild(compilation,fs, callback) {
        const {request, recursive, regExp, resolveDependencies} = this;
        resolveDependencies(fs, request, recursive, regExp, (err, dependencies) => {
            this.dependencies = dependencies;
            callback();
        });
    }

    getUserRequestMap(dependencies) {
        return dependencies.reduce((obj, dep) => {
            obj[dep.request] = dep.module.id;
            return obj
        }, {})
    }

    source(dependencyTemplates) {
        const map = JSON.stringify(this.getUserRequestMap(this.dependencies));
        const source = `var map = ${map};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = ${this.id};`;
        this._source = new OriginalSource(source, this.request);
        const _source = new ReplaceSource(this._source);

        // function dealDependency(dependency) {
        //     const deal = dependencyTemplates.get(dependency.constructor);
        //     deal.apply(dependency, _source)
        // }
        //
        // this.dependencies.forEach(dealDependency);
        //
        // this.requires.forEach(dealRequire);
        return new CachedSource(_source)
    }
}

module.exports = ContextModule;
