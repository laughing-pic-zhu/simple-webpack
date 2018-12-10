class ModuleDependencyTemplateAsId {
    apply(dep, source) {
        if (!Array.isArray(dep.range)) return;
        if (dep.module) {
            const [rang1, rang2] = dep.range;
            source.replace(rang1, rang2, `${dep.module.id}`)
        }
    }
}

module.exports = ModuleDependencyTemplateAsId;
