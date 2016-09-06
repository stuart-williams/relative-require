'use babel'

import { camelCase } from 'lodash'
import path from 'path'
import os from 'os'
import loadDependencies from './load-dependencies'
import findMatchingModules from './find-matching-modules'
import { getStatement, pathsToStatements } from './path-to-statement'

const injectDependencies = (editor, type, modules) => (dependencies) => {
  modules.forEach((module) => {
    if (dependencies.includes(module)) {
      editor.insertText(`${os.EOL}${getStatement(type, camelCase(module), module)}`)
    }
  })
}

const injectModules = (editor, type, activePath) => (modulePaths) => {
  if (!modulePaths.length) return
  pathsToStatements(type, activePath, modulePaths)
    .forEach((statement) => {
      editor.insertText(`${os.EOL}${statement}`)
    })
}

export default (editor, modules, sourceInfo) => {
  const activePath = path.parse(editor.getPath()).dir
  const [ projectPath ] = atom.project.relativizePath(activePath)
  const bufferPos = editor.getBuffer().positionForCharacterIndex(sourceInfo.pos)

  editor.setCursorBufferPosition(bufferPos)

  return loadDependencies(projectPath)
    .then(injectDependencies(editor, sourceInfo.type, modules))
    .then(() => {
      return findMatchingModules(projectPath, modules)
        .then(injectModules(editor, sourceInfo.type, activePath))
    })
    .catch((e) => {
      throw new Error(e)
    })
}
