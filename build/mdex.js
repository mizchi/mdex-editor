(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Toolbar,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.Mdex = {};

require('./utils');

Toolbar = require('./toolbar');

Mdex.shortcuts = {
  'Cmd-B': Mdex.toggleBold,
  'Cmd-I': Mdex.toggleItalic,
  'Cmd-K': Mdex.drawLink,
  'Cmd-Alt-I': Mdex.drawImage,
  "Cmd-'": Mdex.toggleBlockquote,
  'Cmd-Alt-L': Mdex.toggleOrderedList,
  'Cmd-L': Mdex.toggleUnOrderedList
};

Mdex.fixShortcut = function(name) {
  if (/Mac/.test(navigator.platform)) {
    name = name.replace('Ctrl', 'Cmd');
  } else {
    name = name.replace('Cmd', 'Ctrl');
  }
  return name;
};

Mdex.Editor = (function() {
  var toggleFullScreen;

  Editor.prototype.toggleBlockquote = function() {
    return Mdex.toggleBlockquote(this);
  };

  Editor.prototype.toggleUnOrderedList = function() {
    return Mdex.toggleUnOrderedList(this);
  };

  Editor.prototype.toggleOrderedList = function() {
    return Mdex.toggleOrderedList(this);
  };

  Editor.prototype.drawLink = function() {
    return Mdex.drawLink(this);
  };

  Editor.prototype.drawImage = function() {
    return Mdex.drawImage(this);
  };

  Editor.prototype.undo = function() {
    return Mdex.undo(this);
  };

  Editor.prototype.redo = function() {
    return Mdex.redo(this);
  };

  toggleFullScreen = function() {
    return Mdex.toggleFullScreen(this);
  };

  Editor.prototype.toggleBold = function() {
    return Mdex.toggleBold(this);
  };

  Editor.prototype.toggleItalic = function() {
    return Mdex.toggleItalic(this);
  };

  function Editor(_arg) {
    var container, toolbar, _ref;
    _ref = _arg != null ? _arg : {}, container = _ref.container, toolbar = _ref.toolbar, this.status = _ref.status;
    this.toggleItalic = __bind(this.toggleItalic, this);
    this.toggleBold = __bind(this.toggleBold, this);
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
    var $preview, el, key, keyMaps, _fn, _i, _len, _ref;
    if (this._rendered) {
      return;
    }
    el = this.container.querySelector('.editor');
    keyMaps = {};
    keyMaps["Enter"] = "newlineAndIndentContinueMarkdownList";
    _ref = Mdex.shortcuts;
    _fn = (function(_this) {
      return function(key) {
        return keyMaps[Mdex.fixShortcut(key)] = function(cm) {
          return Mdex.shortcuts[key](_this);
        };
      };
    })(this);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      _fn(key);
    }
    this.codemirror = CodeMirror.fromTextArea(el, {
      mode: 'markdown',
      theme: 'paper',
      indentWithTabs: true,
      lineNumbers: false,
      extraKeys: keyMaps
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


},{"./toolbar":2,"./utils":3}],2:[function(require,module,exports){
var Button, Toolbar, createIcon, createSep,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Button = (function() {
  function Button() {
    this.onClick = __bind(this.onClick, this);
    this.el = document.createElement('a');
    this.$el = $(this.el);
  }

  Button.prototype.onClick = function(editor) {};

  return Button;

})();

createIcon = function(name, options) {
  var el, shortcut;
  options = options || {};
  el = document.createElement('a');
  shortcut = options.shortcut || Mdex.shortcuts[name];
  if (shortcut) {
    shortcut = Mdex.fixShortcut(shortcut);
    el.title = shortcut;
    el.title = el.title.replace('Cmd', '⌘');
    if (/Mac/.test(navigator.platform)) {
      el.title = el.title.replace('Alt', '⌥');
    }
  }
  el.className = options.className || 'icon-' + name;
  return el;
};

createSep = function() {
  var el;
  el = document.createElement('i');
  el.className = 'separator';
  el.innerHTML = '|';
  return el;
};

module.exports = Toolbar = (function() {
  function Toolbar(parent) {
    this.parent = parent;
    this._bar = document.createElement('div');
    this._bar.className = 'editor-toolbar';
    this._toolbar = {};
  }

  Toolbar.prototype.createElement = function(item) {
    var el;
    el = item.name ? createIcon(item.name, item) : item === '|' ? createSep() : item.el ? item.el : createIcon(item);
    if (item.action) {
      if ((typeof item.action) === 'function') {
        el.onclick = (function(_this) {
          return function(e) {
            return item.action(_this.parent);
          };
        })(this);
      }
    }
    return el;
  };

  Toolbar.prototype.addButton = function(item) {
    var el, name, _ref;
    el = this.createElement(item);
    name = (_ref = item.name) != null ? _ref : item;
    this._toolbar[name] = el;
    return this._bar.appendChild(el);
  };

  Toolbar.prototype.appendToCodemirror = function() {
    var cm, cmWrapper;
    cm = this.parent.codemirror;
    cm.on('cursorActivity', (function(_this) {
      return function() {
        var key, stat, _i, _len, _ref, _results;
        stat = Mdex.getState(cm);
        _ref = _this._toolbar;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          _results.push((function(key) {
            var el;
            el = _this._toolbar[key];
            if (stat[key]) {
              return el.className += ' active';
            } else {
              return el.className = el.className.replace(/\s*active\s*/g, '');
            }
          })(key));
        }
        return _results;
      };
    })(this));
    cmWrapper = cm.getWrapperElement();
    cmWrapper.parentNode.insertBefore(this._bar, cmWrapper);
    return this._bar;
  };

  return Toolbar;

})();


},{}],3:[function(require,module,exports){
var getState, setLine, _replaceSelection, _toggleLine;

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

Mdex.toggleFullScreen = function(editor) {
  var cancel, doc, el, isFull, request;
  el = editor.codemirror.getWrapperElement();
  doc = document;
  isFull = doc.fullScreen || doc.mozFullScreen || doc.webkitFullScreen;
  request = function() {
    if (el.requestFullScreen) {
      return el.requestFullScreen();
    } else if (el.mozRequestFullScreen) {
      return el.mozRequestFullScreen();
    } else if (el.webkitRequestFullScreen) {
      return el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  };
  cancel = function() {
    if (doc.cancelFullScreen) {
      return doc.cancelFullScreen();
    } else if (doc.mozCancelFullScreen) {
      return doc.mozCancelFullScreen();
    } else if (doc.webkitCancelFullScreen) {
      return doc.webkitCancelFullScreen();
    }
  };
  if (!isFull) {
    return request();
  } else if (cancel) {
    return cancel();
  }
};

Mdex.toggleBold = function(editor) {
  var cm, end, endPoint, start, startPoint, stat, text;
  cm = editor.codemirror;
  stat = getState(cm);
  text = null;
  start = '**';
  end = '**';
  startPoint = cm.getCursor('start');
  endPoint = cm.getCursor('end');
  if (stat.bold) {
    text = cm.getLine(startPoint.line);
    start = text.slice(0, startPoint.ch);
    end = text.slice(startPoint.ch);
    start = start.replace(/^(.*)?(\*|\_){2}(\S+.*)?$/, '$1$3');
    end = end.replace(/^(.*\S+)?(\*|\_){2}(\s+.*)?$/, '$1$3');
    startPoint.ch -= 2;
    endPoint.ch += 2;
    cm.replaceRange(end, startPoint, endPoint);
  } else {
    text = cm.getSelection();
    cm.replaceSelection(start + text + end);
    startPoint.ch += 2;
    endPoint.ch += 2;
  }
  cm.setSelection(startPoint, endPoint);
  return cm.focus();
};

Mdex.toggleItalic = function(editor) {
  var cm, end, endPoint, start, startPoint, stat, text;
  cm = editor.codemirror;
  stat = getState(cm);
  text = null;
  start = '*';
  end = '*';
  startPoint = cm.getCursor('start');
  endPoint = cm.getCursor('end');
  if (stat.italic) {
    text = cm.getLine(startPoint.line);
    start = text.slice(0, startPoint.ch);
    end = text.slice(startPoint.ch);
    start = start.replace(/^(.*)?(\*|\_)(\S+.*)?$/, '$1$3');
    end = end.replace(/^(.*\S+)?(\*|\_)(\s+.*)?$/, '$1$3');
    startPoint.ch -= 1;
    endPoint.ch += 1;
    cm.replaceRange(end, startPoint, endPoint);
  } else {
    text = cm.getSelection();
    cm.replaceSelection(start + text + end);
    startPoint.ch += 1;
    endPoint.ch += 1;
  }
  cm.setSelection(startPoint, endPoint);
  return cm.focus();
};

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
  return _replaceSelection(cm, stat.link, '[', '](http:#)');
};

Mdex.drawImage = function(editor) {
  var cm, stat;
  cm = editor.codemirror;
  stat = getState(cm);
  return _replaceSelection(cm, stat.image, '![', '](http:#)');
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

Mdex.togglePreview = function(editor) {
  var cm, parse, preview, text, toolbar, wrapper;
  toolbar = editor.toolbar.preview;
  parse = editor.constructor.markdown;
  cm = editor.codemirror;
  wrapper = cm.getWrapperElement();
  preview = wrapper.lastChild;
  if (!/editor-preview/.test(preview.className)) {
    preview = document.createElement('div');
    preview.className = 'editor-preview';
    wrapper.appendChild(preview);
  }
  if (/editor-preview-active/.test(preview.className)) {
    preview.className = preview.className.replace(/\s*editor-preview-active\s*/g, '');
    toolbar.className = toolbar.className.replace(/\s*active\s*/g, '');
  } else {
    setTimeout((function() {
      return preview.className += ' editor-preview-active';
    }), 1);
    toolbar.className += ' active';
  }
  text = cm.getValue();
  return preview.innerHTML = parse(text);
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
    cm.setLine(startPoint.line, start + end);
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