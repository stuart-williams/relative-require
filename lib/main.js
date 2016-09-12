'use babel'

import analyseSource from './analyse-source'
import textEditorRequire from './text-editor-require'
import fullPathRequire from './full-path-require'
import config from '../config'

let activeItemSubscription = null

function editorRequire () {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  const module = editor.getSelectedText()
  if (!module) return

  textEditorRequire(editor, module, analyseSource(editor.getText()))
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
  dragDropRequire()
  activeItemSubscription = atom.workspace.onDidChangeActivePaneItem(dragDropRequire)
  atom.commands.add('atom-text-editor', { 'relative-require:require': editorRequire })
  atom.commands.add('atom-text-editor', 'relative-require:editorRequire', editorRequire)
  atom.commands.add('.tree-view .file', 'relative-require:treeViewRequire', treeRequire)
}

function deactivate () {
  activeItemSubscription.dispose()
}

export default {
  config,
  activate,
  deactivate
}
