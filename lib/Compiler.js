"use strict";

const Tapable = require('tapable');
const Parser = require('./Parser');
const NormalModuleFactory = require('./NormalModuleFactory');
const NormalModule = require('./NormalModule');
const fs = require('fs');
var Resolver = require("enhanced-resolve/lib/Resolver");


class Compiler extends Tapable {
    constructor(props) {
        super(props);
        const {context} = props;
        this.parser = new Parser();
        this.modules = {};
        this.context = context;
        this.resolver = {
            normal: new Resolver(null),
            loader: new Resolver(null),
            context: new Resolver(null)
        }
    }

    compile(request) {
        const factory = new NormalModuleFactory({
            parser: this.parser,
            resolver: this.resolver,
            context: this.context,
            loader: [],
            request
        });
        factory.create()
        // const module = new NormalModule({parser: this.parser, request, loaders: [], fileName: 'test'});
        // this.processDependencies(module, this.finishBuild.bind(this));
    }

    processDependencies(module, callback) {
        if (this.modules[module.request]) {
            callback();
            return;
        }
        this.modules[module.request] = module;
        module.doBuild(() => {
            let len = module.fileDependencies.length;
            if (len === 0) {
                callback();
            } else {
                module.fileDependencies.forEach(fileDependency => {
                    const req = fileDependency.request;
                    this.processDependencies(new NormalModule({
                        parser: this.parser,
                        request: req,
                        loaders: [],
                        fileName: 'test'
                    }), () => {
                        len--;
                        if (len === 0) {
                            callback();
                        }
                    });
                });
            }
        });
    }

    finishBuild() {
        console.log(this.modules)
    };

    buildModule() {
    }
}

module.exports = Compiler;
