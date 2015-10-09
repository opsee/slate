module.exports = function(grunt) {
  
  var load = require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodemon:{
      server:{
        script:'run.js',
        options:{
          env:{
            PORT:'7000'
          },
          watch:['run.js','src','config'],
          ext:'js,html',
        }
      },
      test:{
        script:'src/process.js',
        options:{
          env:{
            PORT:'7000'
          },
          watch:['run.js','src','config'],
          ext:'js,html',
        }
      },
    },
  });

  grunt.registerTask('default', ['nodemon']);
};