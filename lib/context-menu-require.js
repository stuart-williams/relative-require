'use babel'

import path from 'path'
import { pathsToStatements } from './path-to-statement'
import analyseSource from './analyse-source'

export default () => {
  const treeView = atom.packages.getActivePackage('tree-view')
  const editor = atom.workspace.getActiveTextEditor()

  if (!treeView || !editor) return

  const activePath = path.parse(editor.getPath()).dir
  const modulePaths = treeView.mainModule.treeView.selectedPaths()

  if (!modulePaths.length) return

  const sourceInfo = analyseSource(editor.getText())
  const bufferPos = editor.getBuffer().positionForCharacterIndex(sourceInfo.pos > 0 ? sourceInfo.pos + 1 : 0)

  editor.setCursorBufferPosition(bufferPos)

  pathsToStatements(sourceInfo.type, activePath, modulePaths).forEach((statement) => {
    editor.insertText(`${statement}\n`)
  })
}
