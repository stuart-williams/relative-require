'use babel'

import path from 'path'
import { pathToStatement } from './path-to-statement'
import determineModuleImportType from './determine-module-import-type'

export default () => {
  const treeView = atom.packages.getActivePackage('tree-view')
  const editor = atom.workspace.getActiveTextEditor()

  if (!treeView || !editor) return

  const activePath = path.parse(editor.getPath()).dir
  const modulePath = treeView.mainModule.treeView.selectedPaths()[0]

  if (!modulePath) return

  determineModuleImportType(modulePath)
    .then((type) => {
      console.log(pathToStatement(type, activePath, modulePath))
    })
}
