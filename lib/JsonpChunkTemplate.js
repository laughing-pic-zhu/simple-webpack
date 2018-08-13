const RawSource = require('./RawSource');
const Template = require('./Template');

class JsonpChunkTemplate extends Template {
    render(chunk) {
        const buf = [];
        buf.push(`webpackJsonp([${chunk.id}], `);
        buf.push(this.renderChunk(chunk));
        return new RawSource(buf.join(''))
    }
}

module.exports = JsonpChunkTemplate;
