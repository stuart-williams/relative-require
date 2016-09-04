const path = require('path')
const textEditorRequire = require('../lib/text-editor-require')
const mockProjectPath = require('./helpers/mock-project-path')
const projectPath = path.join(mockProjectPath, 'editor')

describe('text editor require', () => {
  atom.project.relativizePath = () => [ projectPath ]

  it('should inject the correct import statment', () => {
    waitsForPromise(() => atom.workspace.open(path.join(projectPath, 'active.js'))
      .then((editor) => {
        editor.selectToEndOfWord()
        return textEditorRequire()
          .then(() => {
            editor.selectToBeginningOfLine()
            expect(editor.getSelectedText()).toBe('const target = require(\'./target\')')
          })
      }))
  })
})
