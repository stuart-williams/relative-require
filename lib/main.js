'use babel'

import { camelCase } from 'lodash'
import path from 'path'
import getRequirePaths from './get-require-paths'

const run = (type) => () => {
  let editor = atom.workspace.getActiveTextEditor()
  let fileInfo = path.parse(editor.getPath())
  let [ projectPath ] = atom.project.relativizePath(fileInfo.dir)
  let mod = editor.getSelectedText()

  if (!mod) return

  getRequirePaths(projectPath, mod)
    .then((requirePaths) => {
      if (!requirePaths.length) return
      editor.deleteLine()
      requirePaths.forEach((requirePath) => {
        let varName = camelCase(path.parse(requirePath).name)
        editor.insertNewlineAbove()
        editor.insertText(
          type === 'require'
            ? `var ${varName} = require('${requirePath}')`
            : `import ${varName} from '${requirePath}'`
        )
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
