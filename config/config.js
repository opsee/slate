var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')

module.exports = {
  development: {
    root: rootPath
  },
  test: {
    root: rootPath
  },
  production: {
    root: rootPath
  }
}