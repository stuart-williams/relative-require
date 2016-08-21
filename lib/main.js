'use babel'

import R from 'ramda'
import path from 'path'
import findMatchingModules from './find-matching-modules'
import getRelativePath from './get-relative-path'

function deactivate () {
  console.log('deactivating')
}

function activate () {
  let editor = atom.workspace.getActiveTextEditor()
  let fileInfo = path.parse(editor.getPath())
  let [ projectPath ] = atom.project.relativizePath(fileInfo.dir)

  findMatchingModules(projectPath, 'get-relative-path')
  .then(R.map(getRelativePath(fileInfo.dir)))
  .then((results) => console.log(results))
  .done()
}

export default {
  deactivate,
  activate
}
