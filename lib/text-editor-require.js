'use babel'

import { camelCase } from 'lodash'
import path from 'path'
import loadDependencies from './load-dependencies'
import loadProjectModules from './load-project-modules'
import importStatement from './import-statement'

const getOptions = (editor) => {
  editor.selectToBeginningOfLine()
  let module = editor.getSelectedText()
  let activePath = path.parse(editor.getPath()).dir
  let [ projectPath ] = atom.project.relativizePath(activePath)

  return {
    projectPath,
    module,
    activePath
  }
}

const injectDependency = (editor, options, type) => (dependencies) => {
  if (dependencies.indexOf(options.module) >= 0) {
    editor.deleteLine()
    editor.insertNewlineAbove()
    editor.insertText(importStatement(type, camelCase(options.module), options.module))
    return true
  }
}

const injectProjectModules = (editor, options, type) => (injectedDependency) => {
  if (injectedDependency) return
  return loadProjectModules(options)
    .then((requirePaths) => {
      if (!requirePaths.length) return
      editor.deleteLine()
      requirePaths.forEach((requirePath) => {
        editor.insertNewlineAbove()
        editor.insertText(importStatement(type, camelCase(path.parse(requirePath).name), requirePath))
      })
    })
    .done()
}

export default (type) => () => {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  const options = getOptions(editor)
  if (!options) return

  loadDependencies(options.projectPath)
    .then(injectDependency(editor, options, type))
    .then(injectProjectModules(editor, options, type))
    .done()
}
