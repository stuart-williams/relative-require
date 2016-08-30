'use babel'

import findMatchingModules from './find-matching-modules'
import relativeizeModulePath from './relativeize-module-path'
import { uniq } from 'lodash'

export default (options) =>
  findMatchingModules(options.projectPath, options.module)
    .then((results) => uniq(results.map(relativeizeModulePath(options.activePath))))
