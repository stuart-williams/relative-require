const path = require('path')
const textEditorRequire = require('../lib/text-editor-require')
const mockProjectPath = require('./helpers/mock-project-path')
const projectPath = path.join(mockProjectPath, 'editor')

describe('text editor require', () => {
  atom.project.relativizePath = () => [ projectPath ]

  it('should inject the correct require statment for a single selection', () => {
    waitsForPromise(() => atom.workspace.open(path.join(projectPath, 'active.js'))
      .then((editor) => {
        return textEditorRequire(editor, ['target1'])
          .then(() => {
            expect(editor.getText().replace(/\n/g, '')).toBe('const target1 = require(\'./target1\')')
          })
      }))
  })

  it('should inject the correct require statments for multiple selections', () => {
    waitsForPromise(() => atom.workspace.open(path.join(projectPath, 'active.js'))
      .then((editor) => {
        return textEditorRequire(editor, ['target1', 'target2'])
          .then(() => {
            expect(editor.getText().replace(/\n/g, '')).toBe('const target1 = require(\'./target1\')const target2 = require(\'./target2\')')
          })
      }))
  })

  it('should inject the correct require statment for a package.json dependency', () => {
    waitsForPromise(() => atom.workspace.open(path.join(projectPath, 'active.js'))
      .then((editor) => {
        return textEditorRequire(editor, ['foo'])
          .then(() => {
            expect(editor.getText().replace(/\n/g, '')).toBe('const foo = require(\'foo\')')
          })
      }))
  })

  it('should inject the correct require statments for a mix of package.json dependencies and project modules', () => {
    waitsForPromise(() => atom.workspace.open(path.join(projectPath, 'active.js'))
      .then((editor) => {
        return textEditorRequire(editor, ['foo', 'target1'])
          .then(() => {
            expect(editor.getText().replace(/\n/g, '')).toBe('const foo = require(\'foo\')const target1 = require(\'./target1\')')
          })
      }))
  })
})
