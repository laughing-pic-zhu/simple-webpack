const RawSource = require('./RawSource');
const Template = require('./Template');

class JsonpChunkTemplate extends Template {
    render(chunk, moduleTemplate) {
        const buf = [];
        buf.push(`webpackJsonp([${chunk.id}], `);
        buf.push(this.renderChunk(chunk,moduleTemplate));
        return new RawSource(buf.join(''))
    }
}

module.exports = JsonpChunkTemplate;
