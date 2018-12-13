class HotAcceptDependencyTemplate {
    apply(dep, source) {
        const {dependencies, range, hasCallback} = dep;

        const content = dependencies.map(d => {
            return `__webpack_require__(${d.module.id});`;
        }).join('');
        if (hasCallback) {
            source.insert(range[0], `function(__WEBPACK_OUTDATED_DEPENDENCIES__) { ${content}(`)
            source.insert(range[1], ")(__WEBPACK_OUTDATED_DEPENDENCIES__);}")
            return
        }
        source.insert(range[1] - 1, `,function(__WEBPACK_OUTDATED_DEPENDENCIES__) { ${content}}`)
    }
}

module.exports = HotAcceptDependencyTemplate;
