'use babel'

import R from 'ramda'
import path from 'path'
import findMatchingModules from './find-matching-modules'

function getProjectDirectory (dir) {
  let dirs = atom.project.getDirectories()
  let find = R.find((item) => R.match(new RegExp(item.path), dir).length)
  return find(dirs)
}

function deactivate () {
  console.log('deactivating')
}

function activate () {
  console.log('activating')

  let editor = atom.workspace.getActiveTextEditor()
  let fileInfo = path.parse(editor.getPath())

  findMatchingModules(
    getProjectDirectory(fileInfo.dir).path,
    'find-matching-modules'
  )
  .then((results) => console.log(results))
  .done()
}

export default {
  deactivate,
  activate
}
