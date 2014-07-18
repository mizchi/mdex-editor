module.exports = class Button extends Bn.View
  tagName: 'a'
  @extend: (obj) ->
    c = class extends QcreateEditor.Button
    for key, val of obj then c.prototype[key] = val
    c

  constructor: (@toolbar) ->
    super document.createElement(@tagName)
    @$el.on 'click', @$el,  =>
      @onClick(@toolbar.parent)

  onClick: ->
    throw 'override me'

