var fs = require('fs')
  , express = require('express')
  , http = require('http')
  , logger = require('tracer').colorConsole()
  , slate = require('./src/slate');

var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]

  var port = process.env.PORT || 4000

  var app = express();
  require('./config/express')(app, config);
  require('./config/routes')(app);
  app.listen(port);
  console.log('App started on port '+port);

  // expose app
  exports = module.exports = app

  var example = require('./src/example');
  console.log(slate.testCheck(example));