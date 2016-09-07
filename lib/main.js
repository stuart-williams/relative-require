'use babel'

import analyseSource from './analyse-source'
import treeViewRequire from './tree-view-require'
import textEditorRequire from './text-editor-require'
import { filter, compose, match, length } from 'ramda'

const filterValidExt = filter(compose(length, match(/\.(js|jsx|json)$/)))

let activeItemSubscription = null

function getSelections (editor) {
  return editor.getSelections().reduce((prev, selection) => {
    const text = selection.getText()
    if (!text.match(/[^A-Za-z0-9_-]/g)) prev.push(text)
    return prev
  }, [])
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

  const modules = filterValidExt(treeView.mainModule.treeView.selectedPaths())
  if (!modules.length) return
  treeViewRequire(editor, modules, analyseSource(editor.getText()))
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
  deactivate
}
