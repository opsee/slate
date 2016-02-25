module.exports = function setupGrunt(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodemon: {
      server: {
        script: 'server.js',
        options: {
          env: {
            PORT: '7000'
          },
          watch: ['server.js', 'src', 'config'],
          ext: 'js,html'
        }
      },
      test: {
        script: 'test/index.js',
        options: {
          env: {
            PORT: '7000'
          },
          watch: ['src', 'config', 'test'],
          ext: 'js,html'
        }
      }
    }
  });

  grunt.registerTask('default', ['nodemon:server']);
  grunt.registerTask('test', ['nodemon:test']);
};
