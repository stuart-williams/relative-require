var _ = require('lodash')
var os = require('os')

module.exports = _.curry(function (editor, pos, statements) {
  statements = _.flatten(statements)
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
