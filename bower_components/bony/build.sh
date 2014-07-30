browserify -t coffeeify --extension=".coffee" src/bony.coffee --standalone Bn> dist/bony.js
uglifyjs dist/bony.js > dist/bony.min.js
