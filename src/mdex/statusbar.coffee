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


# not maintained
module.exports = class StatusBar
  createStatusbar: (status) ->
    status = @status

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
