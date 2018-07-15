class WebpackOptionsDefaulter {
    process(options) {
        const copy = {};
        copy.module = {};
        copy.module.rules = [];
        return {...copy, ...options};
    }
}

module.exports = WebpackOptionsDefaulter;
