EventEmitter = require './event-emitter-lite'

{extend} = require './utils'

module.exports = class View
  extend @::, EventEmitter::

  @extend: (params) ->
    class extends View
      extend @::, params

  template: ''
  constructor: (el) ->
    @$el = $(el)
    @render()

  $: -> @$el.find arguments...

  remove: ->
    @off()
    @$el.remove()

  hide: -> @$el.hide()

  show: -> @$el.show()

  detach: ->
    @$el.detach()

  appendTo: (el) ->
    if el instanceof View
      el.$el.append @$el
    else if el instanceof HTMLElement
      @$el.appendTo(el)
    else if el instanceof jQuery
      @$el.appendTo(el)
    else if (typeof el) is 'string'
      $(el).append @$el

  render: ->
    if @template
      @$el.html @template
