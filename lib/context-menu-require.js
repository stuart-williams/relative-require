'use babel'

import path from 'path'
import relativeizeModulePath from './relativeize-module-path'

export default () => {
  const treeView = atom.packages.getActivePackage('tree-view')
  const editor = atom.workspace.getActiveTextEditor()

  if (!treeView || !editor) return

  const activePath = path.parse(editor.getPath()).dir
  const selectedPaths = treeView.mainModule.treeView.selectedPaths()

  console.log(selectedPaths.map(relativeizeModulePath(activePath)))
}
