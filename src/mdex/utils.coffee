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

wrapTextWith = (wrapper) ->
  start = wrapper
  end = wrapper
  size = wrapper.length

  (editor) ->
    cm = editor.codemirror
    startPoint = cm.getCursor('start')
    endPoint   = cm.getCursor('end')
    text = cm.getSelection()

    cm.replaceSelection(start + text + end)
    startPoint.ch += size
    endPoint.ch   += size
    cm.setSelection(startPoint, endPoint)
    cm.focus()

Mdex.toggleBold = wrapTextWith('**')

Mdex.toggleItalic = wrapTextWith('*')

Mdex.toggleStrikeThrough = wrapTextWith('~~')

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
  _replaceSelection(cm, stat.link, '[', '](http://)')

Mdex.drawImage = (editor) ->
  cm = editor.codemirror
  stat = getState(cm)
  _replaceSelection(cm, stat.image, '![', '](http://)')

Mdex.undo = (editor) ->
  cm = editor.codemirror
  cm.undo()
  cm.focus()

Mdex.redo = (editor) ->
  cm = editor.codemirror
  cm.redo()
  cm.focus()

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
    setLine(cm, startPoint.line, start + end)
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
      setLine(cm, i, text)
  cm.focus()
