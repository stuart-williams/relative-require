'use babel'

import textEditorRequire from './text-editor-require'
import contextMenuRequire from './context-menu-require'

function activate () {
  atom.commands.add('atom-text-editor', {
    'relative-require:require': textEditorRequire('require')
  })
  atom.commands.add('atom-text-editor', {
    'relative-require:import': textEditorRequire('import')
  })
  atom.commands.add('atom-workspace', 'relative-require:require', contextMenuRequire)
}

export default {
  activate
}
