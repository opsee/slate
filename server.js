'use strict';

const logger = require('bunyan');
const restify = require('restify');
const slate = require('./src/slate');

const log = new logger({
  name: 'slate',
  streams: [
    {
      stream: process.stdout,
      level: 'info'
    }
  ],
  serializers: restify.bunyan.serializers
});

function respond(req, res, next) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', function onData(data) {
      body += data;
      // limit request size to 1MB.
      if (body.length > 1e6) {
        req.connection.destroy();
        res.send(413);
      }
    });

    req.on('end', function onEnd() {
      const check = JSON.parse(body);
      let slateResp = null;
      let err = null;
      log.debug('check = ' + JSON.stringify(check));

      for (let i = 0; i < check.assertions.length; i++) {
        let assertion = check.assertions[i];
        log.debug('running assertion: ' + JSON.stringify(assertion));

        err = slate.validateAssertion(assertion);
        if (err) {
          log.error('validateResponse returned error: ' + JSON.stringify(err));
          break;
        }

        slateResp = slate.checkAssertion(assertion, check.response);
        if (slateResp.error) {
          log.error('checkAssertion returned error: ' + JSON.stringify(slateResp));
          break;
        }
      }

      if (err) {
        res.send(400, { 'error': err });
      } else {
        res.send(200, slateResp);
      }
    });
  } else {
    res.send(405);
  }
  next();
}

let server = restify.createServer({
  name: 'slate',
  log: log
});
server.post('/check', respond);

server.pre(function restifyServerPre(request, response, next) {
  request.log.info({req: request}, 'start');
  return next();
});

server.on('after', function restifyServerOnAfter(req, res) {
  req.log.info({res: res}, 'finished');
});

server.listen(7000, function restifyServerListen() {
  console.log('%s listening at %s', server.name, server.url);
});
