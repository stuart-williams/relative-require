'use babel'

import { camelCase } from 'lodash'
import path from 'path'
import loadDependencies from './load-dependencies'
import loadProjectModules from './load-project-modules'

const getStatement = (type, varName, requirePath) =>
  type === 'require'
    ? `var ${varName} = require('${requirePath}')`
    : `import ${varName} from '${requirePath}'`

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
    editor.insertText(getStatement(type, camelCase(options.module), options.module))
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
        let varName = camelCase(path.parse(requirePath).name)
        editor.insertText(getStatement(type, varName, requirePath))
      })
    })
    .done()
}

const run = (type) => () => {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  const options = getOptions(editor)
  if (!options) return

  loadDependencies(options.projectPath)
    .then(injectDependency(editor, options, type))
    .then(injectProjectModules(editor, options, type))
    .done()
}

function activate () {
  atom.commands.add('atom-text-editor', {
    'relative-require:require': run('require')
  })
  atom.commands.add('atom-text-editor', {
    'relative-require:import': run('import')
  })
}

export default {
  activate
}
