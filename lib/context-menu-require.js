'use babel'

import path from 'path'
import { pathsToStatements } from './path-to-statement'
import injectStatements from './inject-statements'

export default (editor, modules, sourceInfo) => {
  const activePath = path.parse(editor.getPath()).dir
  const statements = pathsToStatements(sourceInfo.type, activePath, modules)

  if (!statements.length) return

  injectStatements(editor, sourceInfo.pos, statements)
}
