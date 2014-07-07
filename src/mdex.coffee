window.Mdex = {}

require './utils'
Toolbar = require './toolbar'

Mdex.shortcuts =
  'Cmd-B': Mdex.toggleBold,
  'Cmd-I': Mdex.toggleItalic,
  'Cmd-K': Mdex.drawLink,
  'Cmd-Alt-I': Mdex.drawImage,
  "Cmd-'": Mdex.toggleBlockquote,
  'Cmd-Alt-L': Mdex.toggleOrderedList,
  'Cmd-L': Mdex.toggleUnOrderedList

Mdex.fixShortcut = (name) ->
  if /Mac/.test(navigator.platform)
    name = name.replace('Ctrl', 'Cmd')
  else
    name = name.replace('Cmd', 'Ctrl')
  return name

class Mdex.Editor

  toggleBlockquote: -> Mdex.toggleBlockquote(@)

  toggleUnOrderedList: -> Mdex.toggleUnOrderedList(@)

  toggleOrderedList: -> Mdex.toggleOrderedList(@)

  drawLink: -> Mdex.drawLink(@)

  drawImage: -> Mdex.drawImage(@)

  undo: -> Mdex.undo(@)

  redo: -> Mdex.redo(@)

  toggleFullScreen = -> Mdex.toggleFullScreen(this)

  toggleBold: => Mdex.toggleBold(this)

  toggleItalic: => Mdex.toggleItalic(this)

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

    @createToolbar() if @toolbarOption isnt false

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
