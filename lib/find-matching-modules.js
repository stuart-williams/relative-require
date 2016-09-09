'use babel'

import Q from 'q'
import fs from 'fs'
import path from 'path'
import { compose, map, flatten, uniq, join, any, match } from 'ramda'
import { camelCase, kebabCase, snakeCase } from 'lodash'
import walk from 'walkdir'

const excludeDir = (filePath) => {
  const exclude = atom.config.get('relative-require.excludeDirs')
  const matches = any((p) => match(new RegExp(p), path.basename(filePath)).length, exclude)
  return fs.lstatSync(filePath).isDirectory() && matches
}
const validNames = (m) => uniq([ m, camelCase(m), kebabCase(m), snakeCase(m) ])
const moduleNames = compose(join('|'), flatten, map(validNames))

export default (projectPath, modules) => Q.promise((resolve) => {
  const module = new RegExp(`^(${moduleNames(modules)})\\..*$`)
  let results = []

  const walker = walk(projectPath, { follow_symlinks: false }, (filePath) => {
    if (excludeDir(filePath)) {
      walker.ignore(filePath)
    } else if (path.basename(filePath).match(module)) {
      results.push(filePath)
    }
  })

  walker.on('end', () => resolve(results))
})
