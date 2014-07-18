Button = require './_base/button'
module.exports = class Blockquote extends Button
  template: 'Qt'
  onClick: Mdex.toggleBlockquote
