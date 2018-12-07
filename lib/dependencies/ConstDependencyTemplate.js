class ConstDependencyTemplate {
    apply(dep, source) {
        const {value, range} = dep;
        const [range1, range2] = range;
        source.replace(range1, range2, value);
    }
};

module.exports = ConstDependencyTemplate;
