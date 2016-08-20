'use babel'

import R from 'ramda'
import path from 'path'
import findMatchingModules from './find-matching-modules'
import getRelativePath from './get-relative-path'

function getProjectDirectory (dir) {
  let dirs = atom.project.getDirectories()
  let find = R.find((item) => R.match(new RegExp(item.path), dir).length)
  return find(dirs)
}

function deactivate () {
  console.log('deactivating')
}

function activate () {
  let editor = atom.workspace.getActiveTextEditor()
  let fileInfo = path.parse(editor.getPath())
  let projectPath = getProjectDirectory(fileInfo.dir).path

  findMatchingModules(projectPath, 'test')
  .then(R.map(getRelativePath(projectPath, fileInfo.dir)))
  .then((results) => console.log(results))
  .done()
}

export default {
  deactivate,
  activate
}
