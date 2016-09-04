'use babel'

import { camelCase } from 'lodash'
import path from 'path'
import loadDependencies from './load-dependencies'
import findMatchingModules from './find-matching-modules'
import { getStatement, pathsToStatements } from './path-to-statement'
import analyseModule from './analyse-module'

const injectDependencies = (editor, type, modules) => (dependencies) => {
  modules.forEach((module) => {
    if (dependencies.includes(module)) {
      editor.insertText(getStatement(type, camelCase(module), module))
      editor.insertNewlineBelow()
    }
  })
}

const injectModules = (editor, type, activePath) => (modulePaths) => {
  if (!modulePaths.length) return
  pathsToStatements(type, activePath, modulePaths)
    .forEach((statement) => {
      editor.insertText(statement)
      editor.insertNewlineBelow()
    })
}

export default (editor, modules) => {
  const moduleInfo = analyseModule(editor.getText())
  const activePath = path.parse(editor.getPath()).dir
  const [ projectPath ] = atom.project.relativizePath(activePath)
  const bufferPos = editor.getBuffer().positionForCharacterIndex(moduleInfo.pos + 1)

  editor.setCursorBufferPosition(bufferPos)

  return loadDependencies(projectPath)
    .then(injectDependencies(editor, moduleInfo.type, modules))
    .then(() => {
      return findMatchingModules(projectPath, modules)
        .then(injectModules(editor, moduleInfo.type, activePath))
    })
    .catch((e) => {
      throw new Error(e)
    })
}
