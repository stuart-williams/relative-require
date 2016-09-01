'use babel'

import { compose, map, uniq } from 'ramda'
import path from 'path'
import findMatchingModules from './find-matching-modules'
import relativeizeModulePath from './relativeize-module-path'

const removeExt = (item) => item.replace(new RegExp(`${path.parse(item).ext}$`), '')

export default (options) => {
  const parse = compose(removeExt, relativeizeModulePath(options.activePath))
  return findMatchingModules(options.projectPath, options.module)
    .then(map(parse))
    .then(uniq)
}
