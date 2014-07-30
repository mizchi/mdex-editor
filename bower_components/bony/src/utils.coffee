module.exports =
  extend: (obj, props) ->
    for k, v of props then obj[k] = v
    obj

  find: (list, fn) ->
    for i in list
      return i if fn(i)
    null