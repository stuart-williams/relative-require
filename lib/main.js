'use babel'

import textEditorRequire from './text-editor-require'
import contextMenuRequire from './context-menu-require'
import analyseSource from './analyse-source'

function getModules (editor) {
  return editor.getSelections().reduce((prev, selection) => {
    const text = selection.getText()
    if (!text.match(/[^A-Za-z0-9_-]/g)) prev.push(text)
    return prev
  }, [])
}

function editorRequire () {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  textEditorRequire(editor, getModules(editor), analyseSource(editor.getText()))
}

function activate () {
  atom.commands.add('atom-text-editor', {
    'relative-require:require': editorRequire
  })
  atom.commands.add('atom-workspace', 'relative-require:ctmrequire', contextMenuRequire)
}

export default {
  activate
}
