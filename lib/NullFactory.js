class NullFactory {
    create(context, dependency, callback) {
        callback();
    }
}

module.exports = NullFactory;
