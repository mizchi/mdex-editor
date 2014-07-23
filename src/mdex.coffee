window.Mdex = {}
require './mdex/utils'
Mdex.Toolbar = require './mdex/toolbar'
Mdex.Editor  = require './mdex/editor'
Mdex.Button  = require './mdex/buttons/_base/button'

Mdex.Toolbar.registerButton 'bold',           require './mdex/buttons/bold'
Mdex.Toolbar.registerButton 'italic',         require './mdex/buttons/italic'
Mdex.Toolbar.registerButton 'strike',         require './mdex/buttons/strike'
Mdex.Toolbar.registerButton 'blockquote',     require './mdex/buttons/blockquote'
Mdex.Toolbar.registerButton 'unordered-list', require './mdex/buttons/unordered-list'
Mdex.Toolbar.registerButton 'ordered-list',   require './mdex/buttons/ordered-list'
Mdex.Toolbar.registerButton 'preview',        require './mdex/buttons/preview'

module.exports = Mdex
