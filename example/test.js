const SourceNode = require("source-map").SourceNode;

var node = new SourceNode(null, null, null, [
    new SourceNode(1, 0, 'webpack:///./example/a.js', "var a = 1;\n"),
    '\n',
    new SourceNode(3, 0, 'webpack:///./example/a.js', 'console.log(a);"')
]);

node.setSourceContent('index.js', 'var a = 1;\n\nconsole.log(a);')
const t = node.toStringWithSourceMap({file: "index.js"})
const map = t.map.toJSON();
map.sourceRoot = '/';
console.log(JSON.stringify(map))
