const crypto = require('crypto');

const hash = crypto.createHash('md5');

hash.update('Hello');
hash.update('Hello');
hash.update('Hello');

console.log(hash.digest('hex'));
