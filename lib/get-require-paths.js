'use babel'

import path from 'path'
import findMatchingFiles from './find-matching-files'

const parsePath = (activePath) => (modPath) => {
  let relPath = path.relative(activePath, modPath)
  let ext = path.parse(modPath).ext
  return (relPath.startsWith('.') ? relPath : `./${relPath}`).replace(new RegExp(`${ext}$`), '')
}

export default (projectPath, mod) => {
  let editor = atom.workspace.getActiveTextEditor()
  let fileInfo = path.parse(editor.getPath())

  return findMatchingFiles(projectPath, mod)
      .then((results) => results.map(parsePath(fileInfo.dir)))
}
