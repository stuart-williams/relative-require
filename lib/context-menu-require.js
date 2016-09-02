'use babel'

import path from 'path'
import { pathsToStatements } from './path-to-statement'
import analyseModule from './analyse-module'

export default () => {
  const treeView = atom.packages.getActivePackage('tree-view')
  const editor = atom.workspace.getActiveTextEditor()

  if (!treeView || !editor) return

  const activePath = path.parse(editor.getPath()).dir
  const modulePaths = treeView.mainModule.treeView.selectedPaths()

  if (!modulePaths.length) return

  const src = editor.getText()
  const moduleInfo = analyseModule(src)

  const buffer = editor.getBuffer()
  const bufferPos = buffer.positionForCharacterIndex(moduleInfo.pos + 1)

  editor.setCursorBufferPosition(bufferPos)
  pathsToStatements(moduleInfo.type, activePath, modulePaths).forEach((statement) => {
    editor.insertNewlineAbove()
    editor.insertText(statement)
  })
}
