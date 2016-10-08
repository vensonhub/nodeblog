var debug = require('debug');
//DEBUG=nodeblog:* npm start
//DEBUG=nodeblog:* node 1.lesson.js
console.log('debug');
var error_debug = debug('nodeblog:error');
error_debug('error');
var warn_debug = debug('nodeblog:warn');
error_debug('warn');
var log_debug = debug('nodeblog:log');
error_debug('log');