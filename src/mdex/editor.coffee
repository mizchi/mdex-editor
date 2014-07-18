Toolbar = require './toolbar'

module.exports = class Editor
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

    @codemirror = CodeMirror.fromTextArea el,
      mode: 'markdown'
      theme: 'paper'
      indentWithTabs: true
      lineNumbers: false

    @createToolbar() if @toolbarOption isnt false
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
