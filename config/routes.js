var logger = require('tracer').colorConsole()

module.exports = function (app, passport){

  app.get('/', function(req, res, next){
    res.send({msg:'ok'});
    next();
  })

  app.post('/', function(req, res, next){
    console.log(req);
    res.send({msg:'ok'});
    next();
  })

}
