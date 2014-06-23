class Editor
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

  toggleBold: -> toggleBold(this)

  toggleItalic: -> toggleItalic(this)

  constructor: (options = {}) ->
    if options.element
      @element = options.element

    options.toolbar = options.toolbar ? Editor.toolbar
    # you can customize toolbar with object
    # [{name: 'bold', shortcut: 'Ctrl-B', className: 'icon-bold'}]

    unless options.hasOwnProperty('status')
      options.status = ['lines', 'words', 'cursor']

    @options = options

    # If user has passed an element, it should auto rendered
    if @element then @render()

  render: (el) ->
    unless el
      el = @element ? document.getElementsByTagName('textarea')[0]

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

    cm = @codemirror;
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
    status = status || this.options.status;

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

Editor.toolbar = [
  {name: 'bold', action: toggleBold}
  {name: 'italic', action: toggleItalic}
  '|'
  {name: 'quote', action: toggleBlockquote}
  {name: 'unordered-list', action: toggleUnOrderedList}
  {name: 'ordered-list', action: toggleOrderedList}
  '|'
  {name: 'link', action: drawLink}
  # {name: 'image', action: drawImage}
  '|'
  # {name: 'info', action: 'http://lab.lepture.com/editor/markdown'}
  {name: 'preview', action: togglePreview}

  # {name: 'fullscreen', action: toggleFullScreen}
]
