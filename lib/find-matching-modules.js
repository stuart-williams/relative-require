'use babel'

import Q from 'q'
import npath from 'path'
import walk from 'walkdir'
import { isDirectory, caseify } from './helpers'
import { last } from 'ramda'

const dontWalkDirectory = (path) => {
  const exclude = atom.config.get('relative-require.excludeDirs')
  return isDirectory(path) && exclude.some((p) => npath.basename(path).match(new RegExp(p)))
}

const matchIndex = (moduleNameRegex, info) =>
  info.base.match(/index\..*$/) && `${last(info.dir.split(npath.sep))}${info.ext}`.match(moduleNameRegex)

export default (projectPath, module) => Q.promise((resolve) => {
  const moduleNameRegex = new RegExp(`^(${caseify(module).join('|')})\\..*$`)
  let results = []

  const walker = walk(projectPath, { follow_symlinks: false }, (path) => {
    const info = npath.parse(path)
    if (dontWalkDirectory(path)) {
      walker.ignore(path)
    } else if (info.base.match(moduleNameRegex) || matchIndex(moduleNameRegex, info)) {
      results.push(path)
    }
  })

  walker.on('end', () => resolve(results))
})
