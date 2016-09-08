'use babel'

import path from 'path'
import { pathsToStatements } from './path-to-statement'
import injectStatements from './inject-statements'
import { reject } from 'ramda'
import fs from 'fs'

const isDir = (currPath) => fs.lstatSync(currPath).isDirectory()

export default (editor, modules, sourceInfo) => {
  modules = reject(isDir, modules)

  if (!modules.length) return

  const activePath = path.parse(editor.getPath()).dir
  const statements = pathsToStatements(sourceInfo.type, activePath, modules)

  injectStatements(editor, sourceInfo.pos, statements)
}
