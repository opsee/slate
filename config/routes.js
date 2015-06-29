var logger = require('tracer').colorConsole()

module.exports = function (app, passport){

  app.all('/*', function(req, res) {
    res.status(200).send('ok');
  });

  app.use(function(err, req, res, next){
    // treat as 404
    if (err && err.message && ~err.message.indexOf('not found')) return next();
    // return index.render(req,res);
    logger.log(err.message);
    // log it
    console.error(err.stack)
    // error page
    res.status(500).send({error:'500'});
  })

  // assume 404 since no middleware responded
  app.use(function(req, res, next){
    res.status(404).send({ url: req.originalUrl, error: 'Not found' });
  })

}
