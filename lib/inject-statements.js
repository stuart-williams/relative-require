'use babel'

import os from 'os'
import { curry, flatten } from 'ramda'

export default curry((editor, pos, statements) => {
  statements = flatten(statements)
  if (!statements.length) return

  editor.setCursorBufferPosition(editor.getBuffer().positionForCharacterIndex(pos))
  if (pos > 0) {
    editor.moveToEndOfLine()
    editor.insertNewline()
  }
  editor.insertText(statements.join(os.EOL))
  if (pos === 0) {
    editor.insertNewline()
  }
})
