'use babel'

import path from 'path'
import { pathsToStatements } from './path-to-statement'
import determineModuleImportType from './determine-module-import-type'

export default () => {
  const treeView = atom.packages.getActivePackage('tree-view')
  const editor = atom.workspace.getActiveTextEditor()

  if (!treeView || !editor) return

  const activePath = path.parse(editor.getPath()).dir
  const modulePaths = treeView.mainModule.treeView.selectedPaths()

  if (!modulePaths.length) return

  const type = determineModuleImportType(editor.getText())

  console.log(pathsToStatements(type, activePath, modulePaths))
}
