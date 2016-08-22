'use babel'

import { camelCase } from 'lodash'
import path from 'path'
import getRequirePaths from './get-require-paths'

const getImportStatement = (requirePath, type) => {
  let varName = camelCase(path.parse(requirePath).name)

  return type === 'require'
    ? `var ${varName} = require('${requirePath}')`
    : `import ${varName} from '${requirePath}'`
}

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

const run = (type) => () => {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  const options = getOptions(editor)
  if (!options) return

  getRequirePaths(options)
    .then((requirePaths) => {
      if (!requirePaths.length) return
      editor.deleteLine()
      requirePaths.forEach((requirePath) => {
        editor.insertNewlineAbove()
        editor.insertText(getImportStatement(requirePath, type))
      })
    })
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
