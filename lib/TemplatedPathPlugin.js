const REGEXP_NAME = /\[name\]/gi;
const REGEXP_ID = /\[id\]/gi;
const REGEXP_FILE = /\[file\]/gi;
const REGEXP_QUERY = /\[query\]/gi;
const REGEXP_HASH = /\[hash(?::(\d+))?\]/gi;

const replacePathVarabiles = (path, data) => {
    const {chunk = {}, file = '', query = '', hash = ''} = data;
    const {id = '', name = ''} = chunk;
    return path.replace(REGEXP_NAME, name)
        .replace(REGEXP_ID, id)
        .replace(REGEXP_FILE, file)
        .replace(REGEXP_QUERY, query)
        .replace(REGEXP_HASH, hash)
};

class TemplatedPathPlugin {
    apply(compiler) {
        compiler.plugin('compilation', compilation => {
            const mainTemplate = compilation.mainTemplate;
            mainTemplate.plugin('asset-path', replacePathVarabiles)
        })

    }
}

module.exports = TemplatedPathPlugin
