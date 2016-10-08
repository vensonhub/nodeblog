var crypto = require('crypto');

var md5 = crypto.createHash('md5');
var result = md5.update('1').update('2').digest('hex');

console.log(result);