Mdex.Buttons ?= {}

class Mdex.Buttons.Base extends Bn.View
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

class Mdex.Buttons.Bold extends Mdex.Buttons.Base
  template: 'B'
  onClick: Mdex.toggleBold

class Mdex.Buttons.Italic extends Mdex.Buttons.Base
  template: 'I'
  onClick: Mdex.toggleItalic

class Mdex.Buttons.Blockquote extends Mdex.Buttons.Base
  template: 'Qt'
  onClick: Mdex.toggleBlockquote

class Mdex.Buttons.UnorderedList extends Mdex.Buttons.Base
  template: '*.'
  onClick: Mdex.toggleUnOrderedList

class Mdex.Buttons.OrderedList extends Mdex.Buttons.Base
  template: '1.'
  onClick: Mdex.toggleUnOrderedList

createSep = ->
  el = document.createElement('i')
  el.className = 'separator'
  el.innerHTML = '|'
  el

module.exports = class Toolbar
  @registerButton: (name, buttonClass) ->
    @_buttonClasses ?= {}
    @_buttonClasses[name] = buttonClass

  @getButtonClass: (name) -> @_buttonClasses[name]

  constructor: (@parent) ->
    @el = document.createElement('div')
    @el.className = 'editor-toolbar'

  createElement: (name) ->
    if name is '|' then return createSep()
    buttonClass = @constructor.getButtonClass(name)
    btn = new buttonClass @
    btn.$el.get(0)

  addButton: (buttonName) ->
    el = @createElement(buttonName)
    @el.appendChild(el)

  appendToCodemirror: ->
    cm = @parent.codemirror
    cmWrapper = cm.getWrapperElement()
    cmWrapper.parentNode.insertBefore(@el, cmWrapper)
    return @el

Toolbar.registerButton 'bold',           Mdex.Buttons.Bold
Toolbar.registerButton 'italic',         Mdex.Buttons.Italic
Toolbar.registerButton 'blockquote',     Mdex.Buttons.Blockquote
Toolbar.registerButton 'unordered-list', Mdex.Buttons.UnorderedList
Toolbar.registerButton 'ordered-list',   Mdex.Buttons.OrderedList
