console.log 'qcreate-editor'
{extend, find} = Bn.Utils

class MathDialog extends Bn.View
  template: '''
  <button class='ok'>ok</button>
  <button class='cancel'>cancel</button>

  <div class='math-preview' style='height: 200px'></div>
  <textarea class='math-source' style='width:90%; height: 50px; padding: 3px'>
  \\sum_{k=1}^{\\infty} \\frac{1}{k^2} = \\frac{\pi^2}{6}
  </textarea>

  <p class='editable'></p>
  '''

  constructor: ->
    el = document.createElement 'div'
    super el

    $textarea = @$('textarea.math-source')
    $preview = @$('.math-preview')

    @$el.css
      position: 'absolute'
      left: 30
      top: 30
      width: 400
      height: 400
      backgroundColor: 'linen'

    @$('.ok').on 'click', =>
      @trigger 'inputDone', text: $textarea.val()

    @$('.cancel').on 'click', =>
      @trigger 'inputDone', cancelled: true

    $textarea.on 'keydown', =>
      $preview.text '$' + $textarea.val() + '$'
      MathJax.Hub.Queue ["Typeset", MathJax.Hub, $preview.get(0)]

    setTimeout =>
      $textarea.trigger 'keydown'
    , 100

class window.QcreateEditor extends Bn.View
  @getInstance: -> QcreateEditor.instance

  constructor: ->
    super
    QcreateEditor.instance = @

    @editor = @createEditor()
    @editor.render()
    @editor.codemirror.on 'change', =>
      @trigger 'change', @editor.codemirror.getValue()

    # @on 'addMathSection', (tex) =>
    #   body =  @editor.codemirror.getValue()
    #   if body[body.length-1] is '\n'
    #     body = body[0..body.length-2]

    #   @editor.codemirror.setValue body + """\n
    #   ---------
    #   tex: #{tex}
    #   ---------\n
    #   """

    last = (list) -> list[list.length-1]

    mathDialog = new MathDialog
    @on 'openMathDialog', =>
      @waitMathInput(mathDialog).done (text) =>
        console.log 'resolved', text

        body =  @editor.codemirror.getValue()
        if last(body) is '\n'
          body = body[0...body.length-1]

        if last(text) is '\n'
          text = text[0...text.length-1]

        @editor.codemirror.setValue body + """\n
        ---------
        tex: #{text}
        ---------\n
        """

  waitMathInput: (mathDialog) -> $.Deferred (d) =>
    mathDialog.appendTo 'body'
    mathDialog.on 'inputDone', ({cancelled, text}) =>
      mathDialog.off 'inputDone'
      mathDialog.detach()
      return if cancelled
      d.resolve(text)

  createEditor: ->
    mathButton =
      el: do =>
        el = document.createElement('span')
        el.innerText = 'math'
        el
      action: =>
        @trigger 'openMathDialog'

    new Mdex
      editorTarget: '#editor'
      previewTarget: '#preview'
      toolbar: [
        {name: 'bold',           action: Mdex.toggleBold},
        {name: 'italic',         action: Mdex.toggleItalic},
        '|',
        {name: 'quote',          action: Mdex.toggleBlockquote},
        {name: 'unordered-list', action: Mdex.toggleUnOrderedList},
        {name: 'ordered-list',   action: Mdex.toggleOrderedList},
        '|',
        {name: 'link',           action: Mdex.drawLink},
        {name: 'image',          action: Mdex.drawImage},
        '|',
        mathButton
      ]

$ =>
  window.editor = new QcreateEditor

  editor = QcreateEditor.getInstance()
  # editor.on 'change', (val) -> console.log val
