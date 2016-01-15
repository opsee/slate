var logger = require('bunyan');
var restify = require('restify');
var slate = require('./src/slate');

var log = new logger({
  name: 'slate',
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    }
  ],
  serializers: restify.bunyan.serializers
});

function respond(req, res, next) {
  if (req.method == 'POST') {
    var body = '';
    req.on('data', function (data) {
      body += data;
      // limit request size to 1MB.
      if (body.length > 1e6) {
        req.connection.destroy();
        res.send(413);
      }
    });

    req.on('end', function () {
      var check = JSON.parse(body);
      var slateResp = null;
      var err = null;
      log.debug('check = ' + JSON.stringify(check));
      
      for (var i = 0; i < check.assertions.length; i++) {
        var assertion = check.assertions[i];
        log.debug('running assertion: ' + JSON.stringify(assertion));
        
        err = slate.validateAssertion(assertion);
        if (err) {
          log.debug('validateResponse returned error: ' + JSON.stringify(err));
          break;
        }
        
        slateResp = slate.checkAssertion(assertion, check.response);
        if (slateResp.error != null) {
          log.debug('checkAssertion returned error: ' + JSON.stringify(slateResp));
          break;
        }
      }
      
      if (err) {
        res.send(400, { "error": err });
      } else {
        res.send(200, slateResp);
      }
    });
  } else {
    res.send(405);
  }
  next();
}

var server = restify.createServer({
  name: 'slate',
  log: log
});
server.post('/check', respond);

server.pre(function (request, response, next) {
    request.log.info({req: request}, 'start');
      return next();
});

server.on('after', function (req, res, route) {
    req.log.info({res: res}, 'finished');
});

server.listen(7000, function() {
  console.log('%s listening at %s', server.name, server.url);
})
