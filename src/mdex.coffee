window.Mdex = {}

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

toggleFullScreen = (editor) ->
  el = editor.codemirror.getWrapperElement()
  doc = document
  isFull = doc.fullScreen or doc.mozFullScreen or doc.webkitFullScreen
  request = ->
    if el.requestFullScreen
      el.requestFullScreen()
    else if el.mozRequestFullScreen
      el.mozRequestFullScreen()
    else if el.webkitRequestFullScreen
      el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)

  cancel = ->
    if doc.cancelFullScreen
      doc.cancelFullScreen()
    else if doc.mozCancelFullScreen
      doc.mozCancelFullScreen()
    else if doc.webkitCancelFullScreen
      doc.webkitCancelFullScreen()

  if !isFull
    request()
  else if (cancel)
    cancel()

toggleBold = (editor) ->
  cm = editor.codemirror
  stat = getState(cm)

  text = null
  start = '**'
  end = '**'

  startPoint = cm.getCursor('start')
  endPoint = cm.getCursor('end')
  if stat.bold
    text = cm.getLine(startPoint.line)
    start = text.slice(0, startPoint.ch)
    end = text.slice(startPoint.ch)

    start = start.replace(/^(.*)?(\*|\_){2}(\S+.*)?$/, '$1$3')
    end = end.replace(/^(.*\S+)?(\*|\_){2}(\s+.*)?$/, '$1$3')
    startPoint.ch -= 2
    endPoint.ch += 2
    cm.replaceRange(end, startPoint, endPoint)
  else
    text = cm.getSelection()
    cm.replaceSelection(start + text + end)

    startPoint.ch += 2
    endPoint.ch += 2
  cm.setSelection(startPoint, endPoint)
  cm.focus()


toggleItalic = (editor) ->
  cm = editor.codemirror
  stat = getState(cm)

  text = null
  start = '*'
  end = '*'

  startPoint = cm.getCursor('start')
  endPoint = cm.getCursor('end')
  if stat.italic
    text = cm.getLine(startPoint.line)
    start = text.slice(0, startPoint.ch)
    end = text.slice(startPoint.ch)

    start = start.replace(/^(.*)?(\*|\_)(\S+.*)?$/, '$1$3')
    end = end.replace(/^(.*\S+)?(\*|\_)(\s+.*)?$/, '$1$3')
    startPoint.ch -= 1
    endPoint.ch += 1
    cm.replaceRange(end, startPoint, endPoint)
  else
    text = cm.getSelection()
    cm.replaceSelection(start + text + end)

    startPoint.ch += 1
    endPoint.ch += 1
  cm.setSelection(startPoint, endPoint)
  cm.focus()

toggleBlockquote = (editor) ->
  cm = editor.codemirror
  _toggleLine(cm, 'quote')


toggleUnOrderedList = (editor) ->
  cm = editor.codemirror
  _toggleLine(cm, 'unordered-list')


toggleOrderedList = (editor) ->
  cm = editor.codemirror
  _toggleLine(cm, 'ordered-list')

drawLink = (editor) ->
  cm = editor.codemirror
  stat = getState(cm)
  _replaceSelection(cm, stat.link, '[', '](http:#)')

drawImage = (editor) ->
  cm = editor.codemirror
  stat = getState(cm)
  _replaceSelection(cm, stat.image, '![', '](http:#)')

undo = (editor) ->
  cm = editor.codemirror
  cm.undo()
  cm.focus()

redo = (editor) ->
  cm = editor.codemirror
  cm.redo()
  cm.focus()

togglePreview = (editor) ->
  toolbar = editor.toolbar.preview
  parse = editor.constructor.markdown
  cm = editor.codemirror
  wrapper = cm.getWrapperElement()
  preview = wrapper.lastChild
  if !/editor-preview/.test(preview.className)
    preview = document.createElement('div')
    preview.className = 'editor-preview'
    wrapper.appendChild(preview)
  if /editor-preview-active/.test(preview.className)
    preview.className = preview.className.replace(
      /\s*editor-preview-active\s*/g, ''
    )
    toolbar.className = toolbar.className.replace(/\s*active\s*/g, '')
  else
    setTimeout((-> preview.className += ' editor-preview-active'), 1)
    toolbar.className += ' active'
  text = cm.getValue()
  preview.innerHTML = parse(text)

_replaceSelection = (cm, active, start, end) ->
  text = null
  startPoint = cm.getCursor('start')
  endPoint = cm.getCursor('end')
  if active
    text = cm.getLine(startPoint.line)
    start = text.slice(0, startPoint.ch)
    end = text.slice(startPoint.ch)
    cm.setLine(startPoint.line, start + end)
  else
    text = cm.getSelection()
    cm.replaceSelection(start + text + end)

    startPoint.ch += start.length
    endPoint.ch += start.length

  cm.setSelection(startPoint, endPoint)
  cm.focus()

_toggleLine = (cm, name) ->
  stat = getState(cm)
  startPoint = cm.getCursor('start')
  endPoint = cm.getCursor('end')
  repl =
    quote: /^(\s*)\>\s+/,
    'unordered-list': /^(\s*)(\*|\-|\+)\s+/,
    'ordered-list': /^(\s*)\d+\.\s+/
  map =
    quote: '> ',
    'unordered-list': '* ',
    'ordered-list': '1. '

  for i in [startPoint.line..endPoint.line]
    do (i) =>
      text = cm.getLine(i)
      if (stat[name])
        text = text.replace(repl[name], '$1')
      else
        text = map[name] + text
      cm.setLine(i, text)
  cm.focus()

Toolbar = require './toolbar'

class Mdex.Editor
  @markdown: (text) -> marked(text)

  @toggleBold: toggleBold

  @toggleItalic: toggleItalic

  @toggleBlockquote: toggleBlockquote

  @toggleUnOrderedList: toggleUnOrderedList

  @toggleOrderedList: toggleOrderedList

  @drawLink: drawLink

  @drawImage: drawImage

  @undo: undo

  @redo: redo

  @toggleFullScreen: toggleFullScreen

  toggleBlockquote: -> toggleBlockquote(@)

  toggleUnOrderedList: -> toggleUnOrderedList(@)

  toggleOrderedList: -> toggleOrderedList(@)

  drawLink: -> drawLink(@)

  drawImage: -> drawImage(@)

  undo: -> undo(@)

  redo: -> redo(@)

  toggleFullScreen = -> toggleFullScreen(this)

  toggleBold: => toggleBold(this)

  toggleItalic: => toggleItalic(this)

  constructor: ({container, toolbar, @status} = {}) ->
    @toolbarOption = toolbar
    if container instanceof HTMLElement
      @container = container
    else if typeof container is 'string'
      @container = document.querySelector container
    else
      throw 'you must set container options'

  render: ->
    return if @_rendered
    el = @container.querySelector('.editor')

    # keybinds
    keyMaps = {}
    keyMaps["Enter"] = "newlineAndIndentContinueMarkdownList"
    for key in Mdex.shortcuts then do (key) =>
      keyMaps[Mdex.fixShortcut(key)] = (cm) =>
        Mdex.shortcuts[key](@)

    @codemirror = CodeMirror.fromTextArea el,
      mode: 'markdown'
      theme: 'paper'
      indentWithTabs: true
      lineNumbers: false
      extraKeys: keyMaps

    @createToolbar()   if @toolbarOption isnt false

    # on update
    $preview = $ @container.querySelector('.preview')
    @codemirror.on 'update', =>
      $preview.html @onPreviewUpdate(@codemirror.getValue())

    @_rendered = true

  onPreviewUpdate: (text) -> marked(text)

  createToolbar: ->
    @toolbar = new Toolbar(@)
    items = @toolbarOption
    for item in items
      @toolbar.addButton item
    @toolbar.appendToCodemirror(@codemirror)

Mdex.shortcuts =
  'Cmd-B': toggleBold,
  'Cmd-I': toggleItalic,
  'Cmd-K': drawLink,
  'Cmd-Alt-I': drawImage,
  "Cmd-'": toggleBlockquote,
  'Cmd-Alt-L': toggleOrderedList,
  'Cmd-L': toggleUnOrderedList

Mdex.fixShortcut = (name) ->
  if isMac
    name = name.replace('Ctrl', 'Cmd')
  else
    name = name.replace('Cmd', 'Ctrl')
  return name

Mdex.defaultToolbar = [
  {name: 'bold', action: toggleBold}
  {name: 'italic', action: toggleItalic}
  '|'
  {name: 'quote', action: toggleBlockquote}
  {name: 'unordered-list', action: toggleUnOrderedList}
  {name: 'ordered-list', action: toggleOrderedList}
  '|'
  {name: 'link', action: drawLink}
  {name: 'image', action: drawImage}
  '|'
  {name: 'info', action: 'http:#lab.lepture.com/editor/markdown'}
  {name: 'preview', action: togglePreview}
  {name: 'fullscreen', action: toggleFullScreen}
]

# window.Mdex = Mdex.Editor