var fs = require('fs')
  , restify = require('restify')
  , http = require('http')
  , logger = require('tracer').colorConsole()
  , slate = require('./src/slate');

var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]

var example = require('./src/example');
var assertionsArray = example.assertions.map(assertion => {
  return slate(assertion, example.response);
});

console.log(assertionsArray);