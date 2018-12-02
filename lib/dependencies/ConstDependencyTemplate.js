class ConstDependencyTemplate {
    apply(dep, source) {
        const {expression, range} = dep;
        const [range1, range2] = range;
        source.replace(range1, range2, expression);
    }
};

module.exports = ConstDependencyTemplate;
