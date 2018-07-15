const fs = require('fs');
const a = '12345\t\t\t\n';

console.log(a)
fs.writeFile('./output.js',a)

