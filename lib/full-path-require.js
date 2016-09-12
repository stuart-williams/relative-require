'use babel'

import path from 'path'
import { reject } from 'ramda'
import { pathsToStatements } from './statement-helpers'
import { isDirectory } from './helpers'
import injectStatements from './inject-statements'

export default (editor, modules, sourceInfo) => {
  modules = reject(isDirectory, modules)

  if (!modules.length) return

  const activePath = path.parse(editor.getPath()).dir
  const statements = pathsToStatements(sourceInfo.type, activePath, modules)

  injectStatements(editor, sourceInfo.pos, statements)
}
