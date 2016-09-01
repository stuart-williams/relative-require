'use babel'

import path from 'path'
import findMatchingModules from './find-matching-modules'
import { convertPathsToStatements } from './path-to-statement'

export default (type) => () => {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  editor.selectToBeginningOfLine()

  const module = editor.getSelectedText()
  const activePath = path.parse(editor.getPath()).dir
  const [ projectPath ] = atom.project.relativizePath(activePath)

  findMatchingModules(projectPath, module)
    .then((modulePaths) => {
      if (!modulePaths.length) return
      editor.deleteLine()
      const statements = convertPathsToStatements(type, activePath, modulePaths)
      statements.forEach((statement) => {
        editor.insertNewlineAbove()
        editor.insertText(statement)
      })
    })
    .done()
}
