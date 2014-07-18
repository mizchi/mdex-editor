(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.Mdex = {};

require('./mdex/utils');

Mdex.Toolbar = require('./mdex/toolbar');

Mdex.Editor = require('./mdex/editor');

Mdex.Button = require('./mdex/buttons/_base/button');

Mdex.Toolbar.registerButton('bold', require('./mdex/buttons/bold'));

Mdex.Toolbar.registerButton('italic', require('./mdex/buttons/italic'));

Mdex.Toolbar.registerButton('blockquote', require('./mdex/buttons/blockquote'));

Mdex.Toolbar.registerButton('unordered-list', require('./mdex/buttons/unordered-list'));

Mdex.Toolbar.registerButton('ordered-list', require('./mdex/buttons/ordered-list'));


},{"./mdex/buttons/_base/button":2,"./mdex/buttons/blockquote":3,"./mdex/buttons/bold":4,"./mdex/buttons/italic":5,"./mdex/buttons/ordered-list":6,"./mdex/buttons/unordered-list":7,"./mdex/editor":8,"./mdex/toolbar":9,"./mdex/utils":10}],2:[function(require,module,exports){
var Button,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Button = (function(_super) {
  __extends(Button, _super);

  Button.prototype.tagName = 'a';

  Button.extend = function(obj) {
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

  function Button(toolbar) {
    this.toolbar = toolbar;
    Button.__super__.constructor.call(this, document.createElement(this.tagName));
    this.$el.on('click', this.$el, (function(_this) {
      return function() {
        return _this.onClick(_this.toolbar.parent);
      };
    })(this));
  }

  Button.prototype.onClick = function() {
    throw 'override me';
  };

  return Button;

})(Bn.View);


},{}],3:[function(require,module,exports){
var Blockquote, Button,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./_base/button');

module.exports = Blockquote = (function(_super) {
  __extends(Blockquote, _super);

  function Blockquote() {
    return Blockquote.__super__.constructor.apply(this, arguments);
  }

  Blockquote.prototype.template = 'Qt';

  Blockquote.prototype.onClick = Mdex.toggleBlockquote;

  return Blockquote;

})(Button);


},{"./_base/button":2}],4:[function(require,module,exports){
var Bold, Button,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./_base/button');

module.exports = Bold = (function(_super) {
  __extends(Bold, _super);

  function Bold() {
    return Bold.__super__.constructor.apply(this, arguments);
  }

  Bold.prototype.template = 'B';

  Bold.prototype.onClick = Mdex.toggleBold;

  return Bold;

})(Button);


},{"./_base/button":2}],5:[function(require,module,exports){
var Button, Italic,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./_base/button');

module.exports = Italic = (function(_super) {
  __extends(Italic, _super);

  function Italic() {
    return Italic.__super__.constructor.apply(this, arguments);
  }

  Italic.prototype.template = 'I';

  Italic.prototype.onClick = Mdex.toggleItalic;

  return Italic;

})(Button);


},{"./_base/button":2}],6:[function(require,module,exports){
var Button, OrderedList,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./_base/button');

module.exports = OrderedList = (function(_super) {
  __extends(OrderedList, _super);

  function OrderedList() {
    return OrderedList.__super__.constructor.apply(this, arguments);
  }

  OrderedList.prototype.template = '1.';

  OrderedList.prototype.onClick = Mdex.toggleUnOrderedList;

  return OrderedList;

})(Button);


},{"./_base/button":2}],7:[function(require,module,exports){
var Button, UnorderedList,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./_base/button');

module.exports = UnorderedList = (function(_super) {
  __extends(UnorderedList, _super);

  function UnorderedList() {
    return UnorderedList.__super__.constructor.apply(this, arguments);
  }

  UnorderedList.prototype.template = '*.';

  UnorderedList.prototype.onClick = Mdex.toggleUnOrderedList;

  return UnorderedList;

})(Button);


},{"./_base/button":2}],8:[function(require,module,exports){
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


},{"./toolbar":9}],9:[function(require,module,exports){
var Blockquote, Bold, Italic, OrderedList, Toolbar, UnorderedList, createSep;

if (Mdex.Buttons == null) {
  Mdex.Buttons = {};
}

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

Bold = require('./buttons/bold');

Italic = require('./buttons/italic');

Blockquote = require('./buttons/blockquote');

UnorderedList = require('./buttons/unordered-list');

OrderedList = require('./buttons/ordered-list');

Toolbar.registerButton('bold', Bold);

Toolbar.registerButton('italic', Italic);

Toolbar.registerButton('blockquote', Blockquote);

Toolbar.registerButton('unordered-list', UnorderedList);

Toolbar.registerButton('ordered-list', OrderedList);


},{"./buttons/blockquote":3,"./buttons/bold":4,"./buttons/italic":5,"./buttons/ordered-list":6,"./buttons/unordered-list":7}],10:[function(require,module,exports){
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