'use babel'

import path from 'path'
import { convertPathsToStatements } from './path-to-statement'

export default () => {
  const treeView = atom.packages.getActivePackage('tree-view')
  const editor = atom.workspace.getActiveTextEditor()

  if (!treeView || !editor) return

  const activePath = path.parse(editor.getPath()).dir
  const modulePaths = treeView.mainModule.treeView.selectedPaths()

  console.log(convertPathsToStatements('require', activePath, modulePaths))
}
