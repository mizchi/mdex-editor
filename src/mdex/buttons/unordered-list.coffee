Button = require './_base/button'
module.exports = class UnorderedList extends Button
  template: '*.'
  onClick: Mdex.toggleUnOrderedList
