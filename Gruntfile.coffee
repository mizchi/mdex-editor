path = require('path')

module.exports = (grunt) ->
  pkg = require('./package.json')

  grunt.initConfig
    pkg: pkg
    connect:
      livereload:
        options:
          port: 8000
          middleware: (connect) ->
            [
              require('connect-livereload')(),
              connect.static(path.resolve('build')),
              connect.directory(path.resolve('build'))
            ]
    watch:
      editor:
        files: ['*.css', 'src/*']
        tasks: ['build']
        options:
          livereload: true

  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('server', ['connect', 'watch'])
  grunt.registerTask('default', ['server'])
