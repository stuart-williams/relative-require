'use babel'

import Q from 'q'
import npath from 'path'
import walk from 'walkdir'
import { isDirectory, caseify } from './helpers'

const dontWalkDirectory = (path) => {
  const exclude = atom.config.get('relative-require.excludeDirs')
  return isDirectory(path) && exclude.some((p) => npath.basename(path).match(new RegExp(p)))
}

export default (projectPath, module) => Q.promise((resolve) => {
  const isMatch = new RegExp(`^(${caseify(module).join('|')})\\..*$`)
  let results = []

  const walker = walk(projectPath, { follow_symlinks: false }, (path) => {
    if (dontWalkDirectory(path)) {
      walker.ignore(path)
    } else if (npath.basename(path).match(isMatch)) {
      results.push(path)
    }
  })

  walker.on('end', () => resolve(results))
})
