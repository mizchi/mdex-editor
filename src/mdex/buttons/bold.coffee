Button = require './_base/button'
module.exports = class Bold extends Button
  template: 'B'
  onClick: Mdex.toggleBold
