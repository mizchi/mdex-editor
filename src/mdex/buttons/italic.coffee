Button = require './_base/button'
module.exports = class Italic extends Button
  template: 'I'
  onClick: Mdex.toggleItalic
