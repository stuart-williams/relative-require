'use babel'

import { camelCase } from 'lodash'
import path from 'path'
import loadDependencies from './load-dependencies'
import findMatchingModules from './find-matching-modules'
import { getStatement, pathsToStatements } from './path-to-statement'
import analyseModule from './analyse-module'

export default () => {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  const moduleInfo = analyseModule(editor.getText())
  const moduleName = [editor.getSelectedText()]
  const activePath = path.parse(editor.getPath()).dir
  const [ projectPath ] = atom.project.relativizePath(activePath)
  const bufferPos = editor.getBuffer().positionForCharacterIndex(moduleInfo.pos + 1)

  editor.setCursorBufferPosition(bufferPos)

  const injectDependency = (dependency) => {
    editor.insertNewlineAbove()
    editor.insertText(getStatement(moduleInfo.type, camelCase(dependency), dependency))
  }

  const injectModules = (modulePaths) => {
    if (!modulePaths.length) return
    pathsToStatements(moduleInfo.type, activePath, modulePaths)
      .forEach((statement) => {
        editor.insertNewlineAbove()
        editor.insertText(statement)
      })
  }

  loadDependencies(projectPath)
    .then((dependencies) => {
      if (dependencies.includes(moduleName)) {
        injectDependency(moduleName)
      }
      return findMatchingModules(projectPath, moduleName)
        .then(injectModules)
    })
    .done()
}
