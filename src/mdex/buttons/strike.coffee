Button = require './_base/button'
module.exports = class Strike extends Button
  template: '---'
  onClick: Mdex.toggleStrikeThrough
