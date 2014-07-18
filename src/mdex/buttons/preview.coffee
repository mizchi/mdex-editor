Button = require './_base/button'
module.exports = class Preview extends Button
  template: '\>-\<'
  onClick: (editor) =>
    parent = editor.parent
    $preview = parent.$('.preview-container')
    $mdex    = parent.$('.mdex-editor-container')
    if $preview.is ':visible'
      $preview.hide()
      $mdex.width '100%'
    else
      $preview.show()
      $mdex.width '60%'
