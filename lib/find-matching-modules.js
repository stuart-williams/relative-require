'use babel'

import Q from 'q'
import npath from 'path'
import walk from 'walkdir'
import { compose, map, flatten, join } from 'ramda'
import { isDirectory, caseify } from './helpers'

const pathIsModuleMatch = (modules) => (path) => {
  const pipeNames = compose(join('|'), flatten, map(caseify))
  const module = new RegExp(`^(${pipeNames(modules)})\\..*$`)
  return npath.basename(path).match(module)
}

const dontWalkDirectory = (path) => {
  const exclude = atom.config.get('relative-require.excludeDirs')
  return isDirectory(path) && exclude.some((p) => npath.basename(path).match(new RegExp(p)))
}

export default (projectPath, modules) => Q.promise((resolve) => {
  const isMatch = pathIsModuleMatch(modules)
  let results = []

  const walker = walk(projectPath, { follow_symlinks: false }, (path) => {
    if (dontWalkDirectory(path)) {
      walker.ignore(path)
    } else if (isMatch(path)) {
      results.push(path)
    }
  })

  walker.on('end', () => resolve(results))
})
