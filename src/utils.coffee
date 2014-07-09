getState = Mdex.getState = (cm, pos) ->
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

Mdex.toggleFullScreen = (editor) ->
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

Mdex.toggleBold = (editor) ->
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


Mdex.toggleItalic = (editor) ->
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

Mdex.toggleBlockquote = (editor) ->
  cm = editor.codemirror
  _toggleLine(cm, 'quote')


Mdex.toggleUnOrderedList = (editor) ->
  cm = editor.codemirror
  _toggleLine(cm, 'unordered-list')


Mdex.toggleOrderedList = (editor) ->
  cm = editor.codemirror
  _toggleLine(cm, 'ordered-list')

Mdex.drawLink = (editor) ->
  cm = editor.codemirror
  stat = getState(cm)
  _replaceSelection(cm, stat.link, '[', '](http:#)')

Mdex.drawImage = (editor) ->
  cm = editor.codemirror
  stat = getState(cm)
  _replaceSelection(cm, stat.image, '![', '](http:#)')

Mdex.undo = (editor) ->
  cm = editor.codemirror
  cm.undo()
  cm.focus()

Mdex.redo = (editor) ->
  cm = editor.codemirror
  cm.redo()
  cm.focus()

Mdex.togglePreview = (editor) ->
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

setLine = (cm, line, text) ->
  size = cm.getLine(line).length

  startPoint = line: line, ch: 0
  endPoint   = line: line, ch: size - 1

  cm.replaceRange text, startPoint, endPoint

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
      if stat[name]
        text = text.replace(repl[name], '$1')
      else
        text = map[name] + text
      # cm.setLine(i, text)
      setLine(cm, i, text)
  cm.focus()
