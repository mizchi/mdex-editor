(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Mdex, createIcon, createSep, drawImage, drawLink, fixShortcut, getState, isMac, redo, shortcuts, toggleBlockquote, toggleBold, toggleFullScreen, toggleItalic, toggleOrderedList, togglePreview, toggleUnOrderedList, undo, wordCount, _replaceSelection, _toggleLine,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

isMac = /Mac/.test(navigator.platform);

shortcuts = {
  'Cmd-B': toggleBold,
  'Cmd-I': toggleItalic,
  'Cmd-K': drawLink,
  'Cmd-Alt-I': drawImage,
  "Cmd-'": toggleBlockquote,
  'Cmd-Alt-L': toggleOrderedList,
  'Cmd-L': toggleUnOrderedList
};

fixShortcut = function(name) {
  if (isMac) {
    name = name.replace('Ctrl', 'Cmd');
  } else {
    name = name.replace('Cmd', 'Ctrl');
  }
  return name;
};

createIcon = function(name, options) {
  var el, shortcut;
  options = options || {};
  el = document.createElement('a');
  shortcut = options.shortcut || shortcuts[name];
  if (shortcut) {
    shortcut = fixShortcut(shortcut);
    el.title = shortcut;
    el.title = el.title.replace('Cmd', '⌘');
    if (isMac) {
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

getState = function(cm, pos) {
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

toggleFullScreen = function(editor) {
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

toggleBold = function(editor) {
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

toggleItalic = function(editor) {
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

toggleBlockquote = function(editor) {
  var cm;
  cm = editor.codemirror;
  return _toggleLine(cm, 'quote');
};

toggleUnOrderedList = function(editor) {
  var cm;
  cm = editor.codemirror;
  return _toggleLine(cm, 'unordered-list');
};

toggleOrderedList = function(editor) {
  var cm;
  cm = editor.codemirror;
  return _toggleLine(cm, 'ordered-list');
};

drawLink = function(editor) {
  var cm, stat;
  cm = editor.codemirror;
  stat = getState(cm);
  return _replaceSelection(cm, stat.link, '[', '](http:#)');
};

drawImage = function(editor) {
  var cm, stat;
  cm = editor.codemirror;
  stat = getState(cm);
  return _replaceSelection(cm, stat.image, '![', '](http:#)');
};

undo = function(editor) {
  var cm;
  cm = editor.codemirror;
  cm.undo();
  return cm.focus();
};

redo = function(editor) {
  var cm;
  cm = editor.codemirror;
  cm.redo();
  return cm.focus();
};

togglePreview = function(editor) {
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
      return cm.setLine(i, text);
    };
  })(this);
  for (i = _i = _ref = startPoint.line, _ref1 = endPoint.line; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
    _fn(i);
  }
  return cm.focus();
};

wordCount = function(data) {
  var count, i, m, pattern, _i, _ref;
  pattern = /[a-zA-Z0-9_\u0392-\u03c9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
  m = data.match(pattern);
  count = 0;
  if (m === null) {
    return count;
  }
  for (i = _i = 0, _ref = m.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    if (m[i].charCodeAt(0) >= 0x4E00) {
      count += m[i].length;
    } else {
      count += 1;
    }
  }
  return count;
};

Mdex = (function() {
  Mdex.markdown = function(text) {
    return marked(text);
  };

  Mdex.toggleBold = toggleBold;

  Mdex.toggleItalic = toggleItalic;

  Mdex.toggleBlockquote = toggleBlockquote;

  Mdex.toggleUnOrderedList = toggleUnOrderedList;

  Mdex.toggleOrderedList = toggleOrderedList;

  Mdex.drawLink = drawLink;

  Mdex.drawImage = drawImage;

  Mdex.undo = undo;

  Mdex.redo = redo;

  Mdex.toggleFullScreen = toggleFullScreen;

  Mdex.prototype.toggleBold = function() {
    return toggleBold(this);
  };

  Mdex.prototype.toggleItalic = function() {
    return toggleItalic(this);
  };

  function Mdex(_arg) {
    var container, _ref;
    _ref = _arg != null ? _arg : {}, container = _ref.container, this.toolbar = _ref.toolbar, this.status = _ref.status;
    this.toggleItalic = __bind(this.toggleItalic, this);
    this.toggleBold = __bind(this.toggleBold, this);
    if (container instanceof HTMLElement) {
      this.container = container;
    } else if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      throw 'you must set container options';
    }
  }

  Mdex.prototype.render = function() {
    var $preview, el, key, keyMaps, _fn, _i, _len;
    if (this._rendered) {
      return;
    }
    el = this.container.querySelector('.editor');
    keyMaps = {};
    keyMaps["Enter"] = "newlineAndIndentContinueMarkdownList";
    _fn = (function(_this) {
      return function(key) {
        return keyMaps[fixShortcut(key)] = function(cm) {
          return shortcuts[key](_this);
        };
      };
    })(this);
    for (_i = 0, _len = shortcuts.length; _i < _len; _i++) {
      key = shortcuts[_i];
      _fn(key);
    }
    this.codemirror = CodeMirror.fromTextArea(el, {
      mode: 'markdown',
      theme: 'paper',
      indentWithTabs: true,
      lineNumbers: false,
      extraKeys: keyMaps
    });
    if (this.toolbar !== false) {
      this.createToolbar();
    }
    if (this.status !== false) {
      this.createStatusbar();
    }
    $preview = $(this.container.querySelector('.preview'));
    this.codemirror.on('update', (function(_this) {
      return function() {
        return $preview.html(_this.onPreviewUpdate(_this.codemirror.getValue()));
      };
    })(this));
    return this._rendered = true;
  };

  Mdex.prototype.onPreviewUpdate = function(text) {
    return marked(text);
  };

  Mdex.prototype.getCodemirror = function() {
    return this.codemirror;
  };

  Mdex.prototype.getContent = function() {
    return this.getCodemirror().getValue();
  };

  Mdex.prototype.createToolbar = function(items) {
    var bar, cm, cmWrapper, i, item, _fn, _i, _len;
    items = items != null ? items : this.toolbar;
    if (!items || items.length === 0) {
      return;
    }
    bar = document.createElement('div');
    bar.className = 'editor-toolbar';
    this._toolbar = {};
    _fn = (function(_this) {
      return function(item) {
        var el, _ref;
        el = item.name ? createIcon(item.name, item) : item === '|' ? createSep() : item.el ? item.el : createIcon(item);
        if (item.action) {
          if ((typeof item.action) === 'function') {
            el.onclick = function(e) {
              return item.action(_this);
            };
          } else if ((typeof item.action) === 'string') {
            el.href = item.action;
            el.target = '_blank';
          }
        }
        _this._toolbar[(_ref = item.name) != null ? _ref : item] = el;
        return bar.appendChild(el);
      };
    })(this);
    for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
      item = items[i];
      _fn(item);
    }
    cm = this.codemirror;
    cm.on('cursorActivity', (function(_this) {
      return function() {
        var key, stat, _j, _len1, _ref, _results;
        stat = getState(cm);
        _ref = _this._toolbar;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          key = _ref[_j];
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
    cmWrapper.parentNode.insertBefore(bar, cmWrapper);
    return bar;
  };

  Mdex.prototype.createStatusbar = function(status) {
    var bar, cm, cmWrapper, i, name, pos, _fn, _i, _len;
    status = this.status;
    if (!status || status.length === 0) {
      return;
    }
    bar = document.createElement('div');
    bar.className = 'editor-statusbar';
    pos = null;
    cm = this.codemirror;
    _fn = (function(_this) {
      return function(name) {
        var el;
        el = document.createElement('span');
        el.className = name;
        if (name === 'words') {
          el.innerHTML = '0';
          cm.on('update', function() {
            return el.innerHTML = wordCount(cm.getValue());
          });
        } else if (name === 'lines') {
          console.log;
          el.innerHTML = '0';
          cm.on('update', function() {
            return el.innerHTML = cm.lineCount();
          });
        } else if (name === 'cursor') {
          el.innerHTML = '0:0';
          cm.on('cursorActivity', function() {
            pos = cm.getCursor();
            return el.innerHTML = pos.line + ':' + pos.ch;
          });
        }
        return bar.appendChild(el);
      };
    })(this);
    for (i = _i = 0, _len = status.length; _i < _len; i = ++_i) {
      name = status[i];
      _fn(name);
    }
    cmWrapper = this.codemirror.getWrapperElement();
    cmWrapper.parentNode.insertBefore(bar, cmWrapper.nextSibling);
    return bar;
  };

  Mdex.prototype.toggleBlockquote = function() {
    return toggleBlockquote(this);
  };

  Mdex.prototype.toggleUnOrderedList = function() {
    return toggleUnOrderedList(this);
  };

  Mdex.prototype.toggleOrderedList = function() {
    return toggleOrderedList(this);
  };

  Mdex.prototype.drawLink = function() {
    return drawLink(this);
  };

  Mdex.prototype.drawImage = function() {
    return drawImage(this);
  };

  Mdex.prototype.undo = function() {
    return undo(this);
  };

  Mdex.prototype.redo = function() {
    return redo(this);
  };

  toggleFullScreen = function() {
    return toggleFullScreen(this);
  };

  return Mdex;

})();

Mdex.toolbar = [
  {
    name: 'bold',
    action: toggleBold
  }, {
    name: 'italic',
    action: toggleItalic
  }, '|', {
    name: 'quote',
    action: toggleBlockquote
  }, {
    name: 'unordered-list',
    action: toggleUnOrderedList
  }, {
    name: 'ordered-list',
    action: toggleOrderedList
  }, '|', {
    name: 'link',
    action: drawLink
  }, {
    name: 'image',
    action: drawImage
  }, '|', {
    name: 'info',
    action: 'http:#lab.lepture.com/editor/markdown'
  }, {
    name: 'preview',
    action: togglePreview
  }, {
    name: 'fullscreen',
    action: toggleFullScreen
  }
];

window.Mdex = Mdex;


},{}]},{},[1])