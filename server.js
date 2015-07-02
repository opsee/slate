var fs = require('fs')
  , restify = require('restify')
  , http = require('http')
  , logger = require('tracer').colorConsole()
  , slate = require('./src/slate');

var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]

  var port = process.env.PORT || 4000
  var app = restify.createServer();
  app.use(restify.CORS())

  require('./config/routes')(app);


  app.listen(port, function(){
    console.log('App started on port '+port);
  });

  // expose app
  exports = module.exports = app

  var example = require('./src/example');
  var checkResult = slate.testCheck(example);
  console.log(checkResult);
  
  var assertionResult = slate.testAssertion({
    assertion:example.assertions[0],
    response:example.response
  })
  console.log(assertionResult);
