gulp       = require 'gulp'
browserify = require 'gulp-browserify'
rename     = require 'gulp-rename'
watch      = require 'gulp-watch'
plumber    = require 'gulp-plumber'
connect    = require 'connect'
concat     = require 'gulp-concat'

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

gulp.task 'concat', ->
  gulp.src [
    './bower_components/marked/lib/marked.js'
    './bower_components/codemirror/lib/codemirror.js'
    './bower_components/codemirror/addon/edit/continuelist.js'
    './bower_components/codemirror/mode/markdown/markdown.js'
    './bower_components/codemirror/mode/xml/xml.js'
    ]
  .pipe concat('vendor.js')
  .pipe gulp.dest('./build/')
