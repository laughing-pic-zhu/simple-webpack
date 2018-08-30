class Source {
    source() {
        throw new Error('Abstract')
    }

    size() {
        return this.source().length;
    }

    node() {
        throw new Error('Abstract')
    }

    listNode() {
        throw new Error('Abstract')
    }
}

module.exports = Source;
