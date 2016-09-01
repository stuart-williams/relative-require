'use babel'

import { camelCase } from 'lodash'
import path from 'path'
import loadDependencies from './load-dependencies'
import findMatchingModules from './find-matching-modules'
import { getStatement, pathsToStatements } from './path-to-statement'

export default (type) => () => {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  editor.selectToBeginningOfLine()

  const module = editor.getSelectedText()
  const activePath = path.parse(editor.getPath()).dir
  const [ projectPath ] = atom.project.relativizePath(activePath)

  const injectModules = (modulePaths) => {
    if (!modulePaths.length) return
    editor.deleteLine()
    const statements = pathsToStatements(type, activePath, modulePaths)
    statements.forEach((statement) => {
      editor.insertNewlineAbove()
      editor.insertText(statement)
    })
  }

  const injectDependency = (dependency) => {
    editor.deleteLine()
    editor.insertNewlineAbove()
    editor.insertText(getStatement(type, camelCase(dependency), dependency))
  }

  loadDependencies(projectPath)
    .then((dependencies) => {
      if (dependencies.includes(module)) {
        injectDependency(module)
      }
      return findMatchingModules(projectPath, module)
        .then(injectModules)
    })
    .done()
}
