class Source {
    source() {
        throw new Error('Abstract')
    }

    size() {
        return this.source().length;
    }
}

module.exports = Source;
