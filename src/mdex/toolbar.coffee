Mdex.Buttons ?= {}

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

Bold = require './buttons/bold'
Italic = require './buttons/italic'
Blockquote = require './buttons/blockquote'
UnorderedList = require './buttons/unordered-list'
OrderedList = require './buttons/ordered-list'

Toolbar.registerButton 'bold',           Bold
Toolbar.registerButton 'italic',         Italic
Toolbar.registerButton 'blockquote',     Blockquote
Toolbar.registerButton 'unordered-list', UnorderedList
Toolbar.registerButton 'ordered-list',   OrderedList
