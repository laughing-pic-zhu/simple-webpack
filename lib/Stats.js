class Stats {
    constructor(compilation) {
        this.compilation = compilation;
        this.hash = compilation.hash;
    }

    hasErrors() {
        return false
    }

    hasWarnings() {
        return false
    }

    toJson() {
        const compilation = this.compilation;
        const chunk = compilation.chunk;
        const compilationAssets = Object.keys(compilation.assets).map(name => {
            const source = compilation.assets[name];
            return {
                name,
                size: source.size(),
                chunks: [],
                emitted:source.emitted
            }
        });
        const chunks = compilation.chunks.map(chunk => {
            const obj = {
                id: chunk.id,
                rendered: chunk.rendered,
                entry: chunk.entry,
                initial: chunk.isInitial(),
                recorded: chunk.recorded,
                extraAsync: !!chunk.extraAsync,
                size: chunk.modules.lenght,
                names: chunk.name ? [chunk.name] : [],
                files: chunk.files.slice(),
                hash: chunk.renderedHash,
                parents: chunk.parents.map(c => c.id)
            };
            return obj
        });
        const obj = {
            assets: compilationAssets,
            hash: this.hash,
            chunks,
            errors: [],
            warnings: []
        }
        return obj

    }
}

module.exports = Stats;
