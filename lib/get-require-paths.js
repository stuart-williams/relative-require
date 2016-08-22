'use babel'

import path from 'path'
import { uniq } from 'lodash'
import findMatchingFiles from './find-matching-files'

const parsePath = (activePath) => (modPath) => {
  let relPath = path.relative(activePath, modPath)
  let ext = path.parse(modPath).ext
  return (relPath.startsWith('.') ? relPath : `./${relPath}`).replace(new RegExp(`${ext}$`), '')
}

export default (options) =>
  findMatchingFiles(options.projectPath, options.module)
    .then((results) => uniq(results.map(parsePath(options.activePath))))
