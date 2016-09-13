'use babel'

import Q from 'q'
import npath from 'path'
import walk from 'walkdir'
import { isDirectory, caseify } from './helpers'
import { last } from 'ramda'

export default (projectPath, module) => Q.promise((resolve) => {
  const omitExtensions = atom.config.get('relative-require.omitExtensions')
  const excludeDirs = atom.config.get('relative-require.excludeDirs')
  const moduleNameRegex = new RegExp(`^(${caseify(module).join('|')})\\..*$`)
  const indexRegex = new RegExp(`index\\.(${omitExtensions.join('|')})$`)

  const dontWalkDirectory = (path) =>
    isDirectory(path) && excludeDirs.some((p) => npath.basename(path).match(new RegExp(p)))

  const matchIndexFile = (info) => info.base.match(indexRegex) &&
    `${last(info.dir.split(npath.sep))}${info.ext}`.match(moduleNameRegex)

  let results = []

  const walker = walk(projectPath, { follow_symlinks: false }, (path) => {
    const info = npath.parse(path)
    if (dontWalkDirectory(path)) {
      walker.ignore(path)
    } else if (info.base.match(moduleNameRegex) || (!isDirectory(path) && matchIndexFile(info))) {
      results.push(path)
    }
  })

  walker.on('file', (fileName, stat) => {
    console.log(fileName)
  })

  walker.on('end', () => resolve(results))
})
