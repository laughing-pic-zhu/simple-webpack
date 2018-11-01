module.exports = function() {
    function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
        var chunk = require("./" + $hotChunkFilename$);
        hotAddUpdateChunk(chunk.id, chunk.modules);
    }

    function hotDownloadManifest() { // eslint-disable-line no-unused-vars
        try {
            var update = require("./" + $hotMainFilename$);
        } catch(e) {
            return Promise.resolve();
        }
        return Promise.resolve(update);
    }

    function hotDisposeChunk(chunkId) { //eslint-disable-line no-unused-vars
        delete installedChunks[chunkId];
    }
};
