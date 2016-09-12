'use babel'

import fs from 'fs'
import path from 'path'
import { reject } from 'ramda'
import { pathsToStatements } from './statement-helpers'
import injectStatements from './inject-statements'

const isDir = (currPath) => fs.lstatSync(currPath).isDirectory()

export default (editor, modules, sourceInfo) => {
  modules = reject(isDir, modules)

  if (!modules.length) return

  const activePath = path.parse(editor.getPath()).dir
  const statements = pathsToStatements(sourceInfo.type, activePath, modules)

  injectStatements(editor, sourceInfo.pos, statements)
}
