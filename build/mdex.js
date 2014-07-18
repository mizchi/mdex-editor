(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.Mdex = {};

require('./mdex/utils');

Mdex.Toolbar = require('./mdex/toolbar');

Mdex.Editor = require('./mdex/editor');


},{"./mdex/editor":2,"./mdex/toolbar":3,"./mdex/utils":4}],2:[function(require,module,exports){
var Editor, Toolbar;

Toolbar = require('./toolbar');

module.exports = Editor = (function() {
  function Editor(_arg) {
    var container, toolbar, _ref;
    _ref = _arg != null ? _arg : {}, container = _ref.container, toolbar = _ref.toolbar, this.status = _ref.status;
    this.toolbarOption = toolbar;
    if (container instanceof HTMLElement) {
      this.container = container;
    } else if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      throw 'you must set container options';
    }
  }

  Editor.prototype.render = function() {
    var $preview, el;
    if (this._rendered) {
      return;
    }
    el = this.container.querySelector('.editor');
    this.codemirror = CodeMirror.fromTextArea(el, {
      mode: 'markdown',
      theme: 'paper',
      indentWithTabs: true,
      lineNumbers: false
    });
    if (this.toolbarOption !== false) {
      this.createToolbar();
    }
    $preview = $(this.container.querySelector('.preview'));
    this.codemirror.on('update', (function(_this) {
      return function() {
        return $preview.html(_this.onPreviewUpdate(_this.codemirror.getValue()));
      };
    })(this));
    return this._rendered = true;
  };

  Editor.prototype.onPreviewUpdate = function(text) {
    return marked(text);
  };

  Editor.prototype.createToolbar = function() {
    var item, items, _i, _len;
    this.toolbar = new Toolbar(this);
    items = this.toolbarOption;
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      this.toolbar.addButton(item);
    }
    return this.toolbar.appendToCodemirror(this.codemirror);
  };

  return Editor;

})();


},{"./toolbar":3}],3:[function(require,module,exports){
var Toolbar, createSep,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (Mdex.Buttons == null) {
  Mdex.Buttons = {};
}

Mdex.Buttons.Base = (function(_super) {
  __extends(Base, _super);

  Base.prototype.tagName = 'a';

  Base.extend = function(obj) {
    var c, key, val;
    c = (function(_super1) {
      __extends(_Class, _super1);

      function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
      }

      return _Class;

    })(QcreateEditor.Button);
    for (key in obj) {
      val = obj[key];
      c.prototype[key] = val;
    }
    return c;
  };

  function Base(toolbar) {
    this.toolbar = toolbar;
    Base.__super__.constructor.call(this, document.createElement(this.tagName));
    this.$el.on('click', this.$el, (function(_this) {
      return function() {
        return _this.onClick(_this.toolbar.parent);
      };
    })(this));
  }

  Base.prototype.onClick = function() {
    throw 'override me';
  };

  return Base;

})(Bn.View);

Mdex.Buttons.Bold = (function(_super) {
  __extends(Bold, _super);

  function Bold() {
    return Bold.__super__.constructor.apply(this, arguments);
  }

  Bold.prototype.template = 'B';

  Bold.prototype.onClick = Mdex.toggleBold;

  return Bold;

})(Mdex.Buttons.Base);

Mdex.Buttons.Italic = (function(_super) {
  __extends(Italic, _super);

  function Italic() {
    return Italic.__super__.constructor.apply(this, arguments);
  }

  Italic.prototype.template = 'I';

  Italic.prototype.onClick = Mdex.toggleItalic;

  return Italic;

})(Mdex.Buttons.Base);

Mdex.Buttons.Blockquote = (function(_super) {
  __extends(Blockquote, _super);

  function Blockquote() {
    return Blockquote.__super__.constructor.apply(this, arguments);
  }

  Blockquote.prototype.template = 'Qt';

  Blockquote.prototype.onClick = Mdex.toggleBlockquote;

  return Blockquote;

})(Mdex.Buttons.Base);

Mdex.Buttons.UnorderedList = (function(_super) {
  __extends(UnorderedList, _super);

  function UnorderedList() {
    return UnorderedList.__super__.constructor.apply(this, arguments);
  }

  UnorderedList.prototype.template = '*.';

  UnorderedList.prototype.onClick = Mdex.toggleUnOrderedList;

  return UnorderedList;

})(Mdex.Buttons.Base);

Mdex.Buttons.OrderedList = (function(_super) {
  __extends(OrderedList, _super);

  function OrderedList() {
    return OrderedList.__super__.constructor.apply(this, arguments);
  }

  OrderedList.prototype.template = '1.';

  OrderedList.prototype.onClick = Mdex.toggleUnOrderedList;

  return OrderedList;

})(Mdex.Buttons.Base);

createSep = function() {
  var el;
  el = document.createElement('i');
  el.className = 'separator';
  el.innerHTML = '|';
  return el;
};

module.exports = Toolbar = (function() {
  Toolbar.registerButton = function(name, buttonClass) {
    if (this._buttonClasses == null) {
      this._buttonClasses = {};
    }
    return this._buttonClasses[name] = buttonClass;
  };

  Toolbar.getButtonClass = function(name) {
    return this._buttonClasses[name];
  };

  function Toolbar(parent) {
    this.parent = parent;
    this.el = document.createElement('div');
    this.el.className = 'editor-toolbar';
  }

  Toolbar.prototype.createElement = function(name) {
    var btn, buttonClass;
    if (name === '|') {
      return createSep();
    }
    buttonClass = this.constructor.getButtonClass(name);
    btn = new buttonClass(this);
    return btn.$el.get(0);
  };

  Toolbar.prototype.addButton = function(buttonName) {
    var el;
    el = this.createElement(buttonName);
    return this.el.appendChild(el);
  };

  Toolbar.prototype.appendToCodemirror = function() {
    var cm, cmWrapper;
    cm = this.parent.codemirror;
    cmWrapper = cm.getWrapperElement();
    cmWrapper.parentNode.insertBefore(this.el, cmWrapper);
    return this.el;
  };

  return Toolbar;

})();

Toolbar.registerButton('bold', Mdex.Buttons.Bold);

Toolbar.registerButton('italic', Mdex.Buttons.Italic);

Toolbar.registerButton('blockquote', Mdex.Buttons.Blockquote);

Toolbar.registerButton('unordered-list', Mdex.Buttons.UnorderedList);

Toolbar.registerButton('ordered-list', Mdex.Buttons.OrderedList);


},{}],4:[function(require,module,exports){
var getState, setLine, wrapTextWith, _replaceSelection, _toggleLine;

getState = Mdex.getState = function(cm, pos) {
  var data, i, ret, stat, text, types, _i, _len;
  pos = pos || cm.getCursor('start');
  stat = cm.getTokenAt(pos);
  if (!stat.type) {
    return {};
  }
  types = stat.type.split(' ');
  ret = {};
  data = null;
  text = null;
  for (i = _i = 0, _len = types.length; _i < _len; i = ++_i) {
    data = types[i];
    if (data === 'strong') {
      ret.bold = true;
    } else if (data === 'variable-2') {
      text = cm.getLine(pos.line);
      if (/^\s*\d+\.\s/.test(text)) {
        ret['ordered-list'] = true;
      } else {
        ret['unordered-list'] = true;
      }
    } else if (data === 'atom') {
      ret.quote = true;
    } else if (data === 'em') {
      ret.italic = true;
    }
  }
  return ret;
};

wrapTextWith = function(wrapper) {
  var end, size, start;
  start = wrapper;
  end = wrapper;
  size = wrapper.length;
  return function(editor) {
    var cm, endPoint, startPoint, text;
    cm = editor.codemirror;
    startPoint = cm.getCursor('start');
    endPoint = cm.getCursor('end');
    text = cm.getSelection();
    cm.replaceSelection(start + text + end);
    startPoint.ch += size;
    endPoint.ch += size;
    cm.setSelection(startPoint, endPoint);
    return cm.focus();
  };
};

Mdex.toggleBold = wrapTextWith('**');

Mdex.toggleItalic = wrapTextWith('*');

Mdex.toggleStrikeThrough = wrapTextWith('~~');

Mdex.toggleBlockquote = function(editor) {
  var cm;
  cm = editor.codemirror;
  return _toggleLine(cm, 'quote');
};

Mdex.toggleUnOrderedList = function(editor) {
  var cm;
  cm = editor.codemirror;
  return _toggleLine(cm, 'unordered-list');
};

Mdex.toggleOrderedList = function(editor) {
  var cm;
  cm = editor.codemirror;
  return _toggleLine(cm, 'ordered-list');
};

Mdex.drawLink = function(editor) {
  var cm, stat;
  cm = editor.codemirror;
  stat = getState(cm);
  return _replaceSelection(cm, stat.link, '[', '](http://)');
};

Mdex.drawImage = function(editor) {
  var cm, stat;
  cm = editor.codemirror;
  stat = getState(cm);
  return _replaceSelection(cm, stat.image, '![', '](http://)');
};

Mdex.undo = function(editor) {
  var cm;
  cm = editor.codemirror;
  cm.undo();
  return cm.focus();
};

Mdex.redo = function(editor) {
  var cm;
  cm = editor.codemirror;
  cm.redo();
  return cm.focus();
};

setLine = function(cm, line, text) {
  var endPoint, size, startPoint;
  size = cm.getLine(line).length;
  startPoint = {
    line: line,
    ch: 0
  };
  endPoint = {
    line: line,
    ch: size - 1
  };
  return cm.replaceRange(text, startPoint, endPoint);
};

_replaceSelection = function(cm, active, start, end) {
  var endPoint, startPoint, text;
  text = null;
  startPoint = cm.getCursor('start');
  endPoint = cm.getCursor('end');
  if (active) {
    text = cm.getLine(startPoint.line);
    start = text.slice(0, startPoint.ch);
    end = text.slice(startPoint.ch);
    setLine(cm, startPoint.line, start + end);
  } else {
    text = cm.getSelection();
    cm.replaceSelection(start + text + end);
    startPoint.ch += start.length;
    endPoint.ch += start.length;
  }
  cm.setSelection(startPoint, endPoint);
  return cm.focus();
};

_toggleLine = function(cm, name) {
  var endPoint, i, map, repl, startPoint, stat, _fn, _i, _ref, _ref1;
  stat = getState(cm);
  startPoint = cm.getCursor('start');
  endPoint = cm.getCursor('end');
  repl = {
    quote: /^(\s*)\>\s+/,
    'unordered-list': /^(\s*)(\*|\-|\+)\s+/,
    'ordered-list': /^(\s*)\d+\.\s+/
  };
  map = {
    quote: '> ',
    'unordered-list': '* ',
    'ordered-list': '1. '
  };
  _fn = (function(_this) {
    return function(i) {
      var text;
      text = cm.getLine(i);
      if (stat[name]) {
        text = text.replace(repl[name], '$1');
      } else {
        text = map[name] + text;
      }
      return setLine(cm, i, text);
    };
  })(this);
  for (i = _i = _ref = startPoint.line, _ref1 = endPoint.line; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
    _fn(i);
  }
  return cm.focus();
};


},{}]},{},[1])