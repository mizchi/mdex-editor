isMac = /Mac/.test(navigator.platform)

shortcuts =
  'Cmd-B': toggleBold,
  'Cmd-I': toggleItalic,
  'Cmd-K': drawLink,
  'Cmd-Alt-I': drawImage,
  "Cmd-'": toggleBlockquote,
  'Cmd-Alt-L': toggleOrderedList,
  'Cmd-L': toggleUnOrderedList

fixShortcut = (name) ->
  if isMac
    name = name.replace('Ctrl', 'Cmd')
  else
    name = name.replace('Cmd', 'Ctrl')
  return name

createIcon = (name, options) ->
  options = options or {}
  el = document.createElement('a')

  shortcut = options.shortcut or shortcuts[name]
  if shortcut
    shortcut = fixShortcut(shortcut)
    el.title = shortcut
    el.title = el.title.replace('Cmd', '⌘')
    if isMac
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


wordCount = (data) ->
  pattern = /[a-zA-Z0-9_\u0392-\u03c9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g
  m = data.match(pattern)
  count = 0
  if m is null then return count
  for i in [0...m.length]
    if m[i].charCodeAt(0) >= 0x4E00
      count += m[i].length
    else
      count += 1
  return count

class Mdex
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

  toggleBold: => toggleBold(this)

  toggleItalic: => toggleItalic(this)

  constructor: (options = {}) ->
    if options.element
      @element = options.element

    if options.previewTarget
      @previewTarget = options.previewTarget

    if options.editorTarget
      @editorTarget = options.editorTarget

    options.toolbar = options.toolbar ? Mdex.toolbar
    # you can customize toolbar with object
    # [{name: 'bold', shortcut: 'Ctrl-B', className: 'icon-bold'}]

    unless options.hasOwnProperty('status')
      options.status = ['lines', 'words', 'cursor']

    @options = options

    # If user has passed an element, it should auto rendered
    if @element then @render()

  render: (el) ->
    unless el
      el = document.querySelector(@editorTarget)

    if @_rendered and @_rendered is el
      # Already rendered.
      return

    @element = el
    options = @options

    keyMaps = {}
    for key in shortcuts
      do (key) =>
        keyMaps[fixShortcut(key)] = (cm) =>
          shortcuts[key](@)

    keyMaps["Enter"] = "newlineAndIndentContinueMarkdownList"

    @codemirror = CodeMirror.fromTextArea el,
      mode: 'markdown'
      theme: 'paper'
      indentWithTabs: true
      lineNumbers: false
      extraKeys: keyMaps

    if options.toolbar isnt false
      @createToolbar()

    if options.status isnt false
      @createStatusbar()

    @_rendered = @element

    if @previewTarget
      $preview = $(@previewTarget)
      @codemirror.on 'update', =>
        $preview.html(marked(@codemirror.getValue()))

  createToolbar: (items) ->
    items = items ? @options.toolbar

    return if not items or items.length is 0

    bar = document.createElement('div')
    bar.className = 'editor-toolbar'

    @toolbar = {}

    for item, i in items then do (item) =>
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
            item.action(@)
        else if (typeof item.action) is 'string'
          el.href = item.action
          el.target = '_blank'

      @toolbar[item.name ? item] = el
      bar.appendChild(el)

    cm = @codemirror
    cm.on 'cursorActivity', =>
      stat = getState(cm)
      for key in @toolbar
        do (key) =>
          el = @toolbar[key]
          if stat[key]
            el.className += ' active'
          else
            el.className = el.className.replace(/\s*active\s*/g, '')

    cmWrapper = cm.getWrapperElement()
    cmWrapper.parentNode.insertBefore(bar, cmWrapper)
    return bar

  createStatusbar: (status) ->
    status = status or this.options.status

    return if not status or status.length is 0

    bar = document.createElement('div')
    bar.className = 'editor-statusbar'

    pos = null
    cm = @codemirror

    for name, i in status then do (name) =>
      el = document.createElement('span')
      el.className = name
      if name is 'words'
        el.innerHTML = '0'
        cm.on 'update', =>
          el.innerHTML = wordCount(cm.getValue())

      else if name is 'lines'
        console.log
        el.innerHTML = '0'
        cm.on 'update', =>
          el.innerHTML = cm.lineCount()

      else if name is 'cursor'
        el.innerHTML = '0:0'
        cm.on 'cursorActivity', =>
          pos = cm.getCursor()
          el.innerHTML = pos.line + ':' + pos.ch
      bar.appendChild(el)

    cmWrapper = this.codemirror.getWrapperElement()
    cmWrapper.parentNode.insertBefore(bar, cmWrapper.nextSibling)
    return bar

  toggleBlockquote: -> toggleBlockquote(this)

  toggleUnOrderedList: -> toggleUnOrderedList(this)

  toggleOrderedList: -> toggleOrderedList(this)

  drawLink: -> drawLink(this)

  drawImage: -> drawImage(this)

  undo: -> undo(this)

  redo: -> redo(this)

  toggleFullScreen = -> toggleFullScreen(this)

Mdex.toolbar = [
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

window.Mdex = Mdex