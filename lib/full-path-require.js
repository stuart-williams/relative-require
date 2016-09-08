'use babel'

import path from 'path'
import { pathsToStatements } from './path-to-statement'
import injectStatements from './inject-statements'
import { filter, compose, match, length } from 'ramda'

const filterValidExt = filter(compose(length, match(/\.(js|jsx|json)$/)))

export default (editor, modules, sourceInfo) => {
  modules = filterValidExt(modules)

  if (!modules.length) return

  const activePath = path.parse(editor.getPath()).dir
  const statements = pathsToStatements(sourceInfo.type, activePath, modules)

  injectStatements(editor, sourceInfo.pos, statements)
}
