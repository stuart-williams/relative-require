'use babel'

import analyseSource from './analyse-source'
import textEditorRequire from './text-editor-require'
import fullPathRequire from './full-path-require'

let activeItemSubscription = null

function getSelections (editor) {
  const text = editor.getSelectedText()
  return !text.match(/[^A-Za-z0-9_-]/g) ? [text] : []
}

function editorRequire () {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  const modules = getSelections(editor)
  if (!modules.length) return

  textEditorRequire(editor, modules, analyseSource(editor.getText()))
}

function treeRequire () {
  const treeView = atom.packages.getActivePackage('tree-view')
  const editor = atom.workspace.getActiveTextEditor()

  if (!treeView || !editor) return

  const modules = treeView.mainModule.treeView.selectedPaths()
  if (!modules.length) return

  fullPathRequire(editor, modules, analyseSource(editor.getText()))
}

function dragDropRequire () {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return
  editor.editorElement.addEventListener('drop', treeRequire)
}

function activate () {
  atom.packages.activatePackage('tree-view').then(dragDropRequire)
  activeItemSubscription = atom.workspace.onDidChangeActivePaneItem(dragDropRequire)
  atom.commands.add('atom-text-editor', { 'relative-require:require': editorRequire })
  atom.commands.add('atom-text-editor', 'relative-require:editorRequire', editorRequire)
  atom.commands.add('.tree-view .file', 'relative-require:treeViewRequire', treeRequire)
}

function deactivate () {
  activeItemSubscription.dispose()
}

export default {
  activate,
  deactivate,
  config: {
    omitExtensions: {
      order: 1,
      title: 'Omit file extension',
      description: 'Omit the extension from the require path for specified file types.',
      type: 'array',
      default: ['js', 'jsx', 'json']
    }
  }
}
