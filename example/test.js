const SourceNode = require("source-map").SourceNode;

var node = new SourceNode(1, 2, null, [
    new SourceNode(3, 4, null, "uno"),
    "dos",
    [
        "tres",
        new SourceNode(5, 6, "a.js", "quatro")
    ]
]);

// { code: 'unodostresquatro',
//   map: [object SourceMapGenerator] }
const t = node.toStringWithSourceMap({file: "my-output-file.js"})

console.log(t.map.toJSON())
