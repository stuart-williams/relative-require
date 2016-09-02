'use babel'

import textEditorRequire from './text-editor-require'
import contextMenuRequire from './context-menu-require'

function activate () {
  atom.commands.add('atom-text-editor', {
    'relative-require:require': textEditorRequire
  })
  atom.commands.add('atom-workspace', 'relative-require:ctmrequire', contextMenuRequire)
}

export default {
  activate
}
