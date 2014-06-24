# mdex

Extended markdown editor forked by `lepture/editor`

![](http://i.gyazo.com/0a0a03293b804fd2c275e63aa7561591.png)

## Features

- Rewriten by CoffeeScript
- Realtime preview

## Requirements

- jQuery
- CodeMirror
- marked
- icomoon

## Usage

See `build` directory.

```html
<div class="mdex-container">
  <div class="mdex-editor-container">
    <textarea id="editor"></textarea>
  </div>
  <div id='preview'></div>
</div>
```

```javascript
var editor = new Editor({
  editorTarget: '#editor',
  previewTarget: '#preview',
  toolbar: [
    {name: 'bold',           action: Editor.toggleBold},
    {name: 'italic',         action: Editor.toggleItalic},
    '|',
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

TODO: easy custom button

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
