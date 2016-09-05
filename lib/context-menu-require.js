'use babel'

import path from 'path'
import os from 'os'
import { pathsToStatements } from './path-to-statement'

export default (editor, modules, sourceInfo) => {
  const activePath = path.parse(editor.getPath()).dir
  const bufferPos = editor.getBuffer().positionForCharacterIndex(sourceInfo.pos > 0 ? sourceInfo.pos + 1 : 0)

  editor.setCursorBufferPosition(bufferPos)

  pathsToStatements(sourceInfo.type, activePath, modules).forEach((statement) => {
    editor.insertText(`${statement}${os.EOL}`)
  })
}
