const REGEXP_NAME = /\[name\]/gi;
const REGEXP_ID = /\[id\]/gi;
const REGEXP_FILE = /\[file\]/gi;

const replacePathVarabiles = (path, data) => {
    const {chunk = {}} = data;
    const {id = '', file = '', name = ''} = chunk;
    return path.replace(REGEXP_NAME, name).replace(REGEXP_ID, id).replace(REGEXP_FILE, file)
};

class TemplatedPathPlugin {
    apply(compiler) {
        compiler.plugin('compilation', compilation => {
            const mainTemplate = compilation.mainTemplate;
            mainTemplate.plugin('asset-path', replacePathVarabiles)
        })

    }
}

module.exports=TemplatedPathPlugin
