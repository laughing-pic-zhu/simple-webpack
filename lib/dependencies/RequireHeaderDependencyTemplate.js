class RequireHeaderDependencyTemplate {
    apply(dep, source) {
        const [rang1, rang2] = dep.range;
        source.replace(rang1, rang2, "__webpack_require__");
    }
}

module.exports = RequireHeaderDependencyTemplate;
