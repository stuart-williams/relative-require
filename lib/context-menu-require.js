'use babel'

import path from 'path'
import os from 'os'
import { pathsToStatements } from './path-to-statement'

export default (editor, modules, sourceInfo) => {
  const activePath = path.parse(editor.getPath()).dir
  const statements = pathsToStatements(sourceInfo.type, activePath, modules)

  if (!statements.length) return

  editor.setCursorBufferPosition(editor.getBuffer().positionForCharacterIndex(sourceInfo.pos))
  if (sourceInfo.pos > 0) {
    editor.moveToEndOfLine()
    editor.insertNewline()
  }
  editor.insertText(statements.join(os.EOL))
  if (sourceInfo.pos === 0) {
    editor.insertNewline()
  }
}
