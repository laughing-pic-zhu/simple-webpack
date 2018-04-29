const fs = require('fs');


fs.readFile('./a.js', function (err, content) {
    console.log(content.toString())
    fs.writeFileSync('test2.js', content.toString());
});
