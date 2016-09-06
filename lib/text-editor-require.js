'use babel'

import Q from 'q'
import { flatten } from 'ramda'
import { camelCase } from 'lodash'
import path from 'path'
import os from 'os'
import loadDependencies from './load-dependencies'
import findMatchingModules from './find-matching-modules'
import { getStatement, pathsToStatements } from './path-to-statement'

const getDependencyStatements = (editor, type, modules) => (dependencies) => {
  return modules.reduce((out, module) =>
    dependencies.includes(module)
      ? out.concat(getStatement(type, camelCase(module), module))
      : out, [])
}

const getModuleStatements = (editor, type, activePath) => (modulePaths) => {
  if (!modulePaths.length) return []
  return pathsToStatements(type, activePath, modulePaths)
}

const injectStatements = (editor, pos) => (statements) => {
  statements = flatten(statements)
  if (!statements.length) return

  editor.setCursorBufferPosition(editor.getBuffer().positionForCharacterIndex(pos))
  if (pos > 0) {
    editor.moveToEndOfLine()
    editor.insertNewline()
  }
  editor.insertText(statements.join(os.EOL))
  if (pos === 0) {
    editor.insertNewline()
  }
}

export default (editor, modules, sourceInfo) => {
  const activePath = path.parse(editor.getPath()).dir
  const [ projectPath ] = atom.project.relativizePath(activePath)

  return Q.all([
    loadDependencies(projectPath)
      .then(getDependencyStatements(editor, sourceInfo.type, modules)),
    findMatchingModules(projectPath, modules)
      .then(getModuleStatements(editor, sourceInfo.type, activePath))
  ])
  .then(injectStatements(editor, sourceInfo.pos))
  .catch((e) => {
    throw new Error(e)
  })
}
