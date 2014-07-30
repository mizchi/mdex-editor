!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Bony=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
if (window.Bn == null) {
  window.Bn = {};
}

Bn.View = _dereq_('./view');

Bn.EventEmitter = _dereq_('./event-emitter-lite');

Bn.Utils = _dereq_('./utils');


},{"./event-emitter-lite":2,"./utils":3,"./view":4}],2:[function(_dereq_,module,exports){
var EventEmitterLite,
  __slice = [].slice;

module.exports = EventEmitterLite = (function() {
  function EventEmitterLite() {}

  EventEmitterLite.prototype.on = function(eventName, callback) {
    var _base;
    if (this._events == null) {
      this._events = [];
    }
    if ((_base = this._events)[eventName] == null) {
      _base[eventName] = [];
    }
    this._events[eventName].push(callback);
    return this;
  };

  EventEmitterLite.prototype.off = function(eventName, fn) {
    var n, _ref;
    if (arguments.length === 0) {
      delete this.events;
      return this;
    }
    if (fn != null) {
      n = (_ref = this.events[eventName]) != null ? _ref.indexOf(fn) : void 0;
      if (n > -1) {
        this._events[eventName].splice(n, 1);
      }
    } else {
      delete this._events[eventName];
    }
    return this;
  };

  EventEmitterLite.prototype.trigger = function() {
    var args, eventName, _ref, _ref1;
    eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if ((_ref = this._events) != null) {
      if ((_ref1 = _ref[eventName]) != null) {
        _ref1.map(function(callback) {
          return callback.apply(null, args);
        });
      }
    }
    return this;
  };

  return EventEmitterLite;

})();


},{}],3:[function(_dereq_,module,exports){
module.exports = {
  extend: function(obj, props) {
    var k, v;
    for (k in props) {
      v = props[k];
      obj[k] = v;
    }
    return obj;
  },
  find: function(list, fn) {
    var i, _i, _len;
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      i = list[_i];
      if (fn(i)) {
        return i;
      }
    }
    return null;
  }
};


},{}],4:[function(_dereq_,module,exports){
var EventEmitter, View, extend,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = _dereq_('./event-emitter-lite');

extend = _dereq_('./utils').extend;

module.exports = View = (function() {
  extend(View.prototype, EventEmitter.prototype);

  View.extend = function(params) {
    return (function(_super) {
      __extends(_Class, _super);

      function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
      }

      extend(_Class.prototype, params);

      return _Class;

    })(View);
  };

  View.prototype.template = '';

  function View(el) {
    this.$el = $(el);
    this.render();
  }

  View.prototype.$ = function() {
    var _ref;
    return (_ref = this.$el).find.apply(_ref, arguments);
  };

  View.prototype.remove = function() {
    this.off();
    return this.$el.remove();
  };

  View.prototype.hide = function() {
    return this.$el.hide();
  };

  View.prototype.show = function() {
    return this.$el.show();
  };

  View.prototype.detach = function() {
    return this.$el.detach();
  };

  View.prototype.appendTo = function(el) {
    if (el instanceof View) {
      return el.$el.append(this.$el);
    } else if (el instanceof HTMLElement) {
      return this.$el.appendTo(el);
    } else if (el instanceof jQuery) {
      return this.$el.appendTo(el);
    } else if ((typeof el) === 'string') {
      return $(el).append(this.$el);
    }
  };

  View.prototype.render = function() {
    if (this.template) {
      return this.$el.html(this.template);
    }
  };

  return View;

})();


},{"./event-emitter-lite":2,"./utils":3}]},{},[1])
(1)
});