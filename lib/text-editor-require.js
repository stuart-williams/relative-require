'use babel'

import { camelCase } from 'lodash'
import path from 'path'
import loadDependencies from './load-dependencies'
import findMatchingModules from './find-matching-modules'
import { getStatement, pathsToStatements } from './path-to-statement'
import analyseModule from './analyse-module'

const getModules = (editor) => {
  return editor.getSelections().reduce((prev, selection) => {
    const text = selection.getText()
    if (!text.match(/[^A-Za-z0-9_-]/g)) prev.push(text)
    return prev
  }, [])
}

const injectDependencies = (editor, type, modules) => (dependencies) => {
  modules.forEach((module) => {
    if (dependencies.includes(module)) {
      editor.insertNewlineAbove()
      editor.insertText(getStatement(type, camelCase(module), module))
    }
  })
}

const injectModules = (editor, type, activePath) => (modulePaths) => {
  if (!modulePaths.length) return
  pathsToStatements(type, activePath, modulePaths)
    .forEach((statement) => {
      editor.insertNewlineAbove()
      editor.insertText(statement)
    })
}

export default () => {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  const moduleInfo = analyseModule(editor.getText())
  const modules = getModules(editor)
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
