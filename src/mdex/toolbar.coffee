Mdex.Buttons ?= {}

createSep = ->
  el = document.createElement('i')
  el.className = 'separator'
  el.innerHTML = '|'
  el

Button = require './buttons/_base/button'

module.exports = class Toolbar
  @registerButton: (name, buttonClass) ->
    throw name+' is not button class' unless buttonClass?
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

