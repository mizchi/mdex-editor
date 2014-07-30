module.exports = class EventEmitterLite
  on: (eventName, callback) ->
    @_events ?= []
    @_events[eventName] ?= []
    @_events[eventName].push callback
    @

  off: (eventName, fn) ->
    if arguments.length is 0
      delete @events
      return @
    if fn?
      # n = _.findIndex @events[eventName], (i) -> i is fn
      n = @events[eventName]?.indexOf fn
      if n > -1
        @_events[eventName].splice n, 1
    else
      delete @_events[eventName]
    @

  trigger: (eventName, args...) ->
    @_events?[eventName]?.map (callback) ->
      callback args...
    @
