createIcon = (name, options) ->
  options = options or {}
  el = document.createElement('a')

  shortcut = options.shortcut or Mdex.shortcuts[name]
  if shortcut
    shortcut = Mdex.fixShortcut(shortcut)
    el.title = shortcut
    el.title = el.title.replace('Cmd', '⌘')
    if /Mac/.test(navigator.platform)
      el.title = el.title.replace('Alt', '⌥')

  el.className = options.className or 'icon-' + name
  return el

createSep = ->
  el = document.createElement('i')
  el.className = 'separator'
  el.innerHTML = '|'
  return el

getState = (cm, pos) ->
  pos = pos or cm.getCursor('start')
  stat = cm.getTokenAt(pos)
  if !stat.type then return {}

  types = stat.type.split(' ')

  ret = {}
  data = null
  text = null
  for data, i in types
    if data is 'strong'
      ret.bold = true
    else if data is 'variable-2'
      text = cm.getLine(pos.line)
      if /^\s*\d+\.\s/.test(text)
        ret['ordered-list'] = true
      else
        ret['unordered-list'] = true
    else if data is 'atom'
      ret.quote = true
    else if data is 'em'
      ret.italic = true
  return ret


module.exports = class Toolbar
  constructor: (@parent) ->
    @_bar = document.createElement('div')
    @_bar.className = 'editor-toolbar'
    @_toolbar = {}

  createElement: (item) ->
    el =
      if item.name
        createIcon(item.name, item)
      else if item is '|'
        createSep()
      else if item.el
        item.el
      else
        createIcon(item)
    if item.action
      if (typeof item.action) is 'function'
        el.onclick = (e) =>
          item.action(@parent)
    el

  addButton: (item) ->
    el = @createElement(item)
    name = item.name ? item

    @_toolbar[name] = el
    @_bar.appendChild(el)

  appendToCodemirror: ->
    cm = @parent.codemirror
    cm.on 'cursorActivity', =>
      stat = getState(cm)
      for key in @_toolbar then do (key) =>
        el = @_toolbar[key]
        if stat[key]
          el.className += ' active'
        else
          el.className = el.className.replace(/\s*active\s*/g, '')

    cmWrapper = cm.getWrapperElement()
    cmWrapper.parentNode.insertBefore(@_bar, cmWrapper)
    return @_bar
