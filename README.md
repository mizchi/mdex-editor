# mdex

Extended markdown editor: fork of `lepture/editor`

![](http://i.gyazo.com/0a0a03293b804fd2c275e63aa7561591.png)

## Features

- Real time preview
- Adding Custome buttons
- Rewriten by CoffeeScript
- Easy to build by gulp

## Requirements

- jQuery
- CodeMirror
- marked
- icomoon

## Usage

I'll fix to make it easier to load later.

1. load javascript dependencies
2. Put `icomoon` to your assets root (Fix later!)
3. load `build/mdex.js`
4. load `build/mdex.css`

See `build` directory in detail.


Prepare html

```html
<div class="mdex-container">
  <div class="mdex-editor-container">
    <textarea id="editor"></textarea>
  </div>
  <div id='preview'></div>
</div>
```

Instantiate

```javascript
var editor = new Editor({
  editorTarget: '#editor',
  previewTarget: '#preview',
  toolbar: [
    {name: 'bold',           action: Editor.toggleBold},
    {name: 'italic',         action: Editor.toggleItalic},
    '|', // splitter
    {name: 'quote',          action: Editor.toggleBlockquote},
    {name: 'unordered-list', action: Editor.toggleUnOrderedList},
    {name: 'ordered-list',   action: Editor.toggleOrderedList},
    '|',
    {name: 'link',           action: Editor.drawLink},
    {name: 'image',          action: Editor.drawImage},
  ]
});
editor.render();
```

## Custom Button

You can add raw HTML element to toolbar.

```javascript
// create element to add
var el = document.createElement('span')
el.innerText = 'hello';

var myButton = {
  el: el,
  action: function(){
    console.log('hello');
  }
};

var editor = new Mdex({
  editorTarget: '#editor',
  previewTarget: '#preview',
  toolbar: [myButton]
});
editor.render();
```

Codemirror instance exists `editor.codemirror`.

(I tried many wysiwyg editor but most of them locked me strongly...)

## Development

```sh
$ npm install gulp -g
$ gulp dev
$ open build/index.html
```

## Special thanks

I started this project in quipper working time. Thanks to All quipper guys!

## License

Copyright (c) 2014 by Koutaro Chikuba
Copyright (c) 2013 - 2014 by Hsiaoming Yang

Permission is hereby granted, free of charge to any noncommercial projects (paid for commercial support), including the rights to use, copy, modify, merge of the Software. Limitation of the rights to publish, distribute, and/or sell copies of the Software.

The above copyright notice and this permission notice shall be included in all copies of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
