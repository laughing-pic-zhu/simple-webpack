const crypto = require('crypto');

let hash = crypto.createHash("md5");

hash.update('111')


hash.update('111')


hash.update('111')
hash = hash.digest("hex");

console.log(hash)
