/**
 * Module dependencies.
 */

var express = require('express')
, bodyParser = require('body-parser')
, methodOverride = require('method-override')
, router = express.Router()
, swig = require('swig')

module.exports = function (app, config, passport) {

  app.set('showStackError', true)
  app.use('/public', express.static(config.root + '/public'))

  // set views path, template engine and default layout
  app.engine('html', swig.renderFile);
  
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'html');

  app.locals.pretty = true;
  
  // enable jsonp
  app.enable("jsonp callback")

  // bodyParser should be above methodOverride
  app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}));
  app.use(bodyParser.json({limit:'50mb'}));
  app.use(methodOverride());


}
