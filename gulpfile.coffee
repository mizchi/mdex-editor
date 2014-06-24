gulp       = require 'gulp'
browserify = require 'gulp-browserify'
rename     = require 'gulp-rename'
watch      = require 'gulp-watch'
plumber    = require 'gulp-plumber'
connect    = require 'connect'

gulp.task 'coffee', ->
  gulp
    .src 'src/editor.coffee', read: false
    .pipe plumber()
    .pipe browserify
      transform: ['coffeeify']
      extensions: ['.coffee']
      debug: true
    .pipe rename 'mdex-editor.js'
    .pipe gulp.dest './build'

gulp.task 'server', (next) ->
  connect()
    .use connect.static './build'
    .listen 3456, next

gulp.task 'dev', ['server'], ->
  gulp.watch('src/**/*.coffee', ['coffee'])

gulp.task 'default', ['coffee']
