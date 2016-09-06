const path = require('path')
const os = require('os')
const textEditorRequire = require('../lib/text-editor-require')
const mockProjectPath = require('./helpers/mock-project-path')
const projectPath = path.join(mockProjectPath, 'editor')

describe('text editor require', () => {
  atom.project.relativizePath = () => [ projectPath ]

  let editor = null

  beforeEach(() => {
    waitsForPromise(() => atom.workspace.open(path.join(projectPath, 'active.js')).then((e) => {
      editor = e
    }))
  })

  it('should inject the correct statment for a single selection', () => {
    waitsForPromise(() =>
      textEditorRequire(editor, ['target1'], { type: 'require', pos: 0 })
        .then(() => {
          expect(editor.getText()).toBe(`const target1 = require('./target1')${os.EOL}`)
        }))
  })

  it('should inject the correct statments for multiple selections', () => {
    waitsForPromise(() =>
      textEditorRequire(editor, ['target1', 'target2'], { type: 'require', pos: 0 })
        .then(() => {
          expect(editor.getText()).toBe(
            `const target1 = require('./target1')${os.EOL}const target2 = require('./target2')${os.EOL}`
          )
        }))
  })

  it('should inject the correct statment for a package.json dependency', () => {
    waitsForPromise(() =>
      textEditorRequire(editor, ['foo'], { type: 'require', pos: 0 })
        .then(() => {
          expect(editor.getText()).toBe(`const foo = require('foo')${os.EOL}`)
        }))
  })

  it('should inject the correct statments native node modules', () => {
    waitsForPromise(() =>
      textEditorRequire(editor, ['fs', 'path'], { type: 'require', pos: 0 })
        .then(() => {
          expect(editor.getText()).toBe(`const fs = require('fs')${os.EOL}const path = require('path')${os.EOL}`)
        }))
  })

  it('should inject the correct statments for a mix of package.json dependencies and project modules', () => {
    waitsForPromise(() =>
      textEditorRequire(editor, ['foo', 'target1'], { type: 'require', pos: 0 })
        .then(() => {
          expect(editor.getText()).toBe(
            `const foo = require('foo')${os.EOL}const target1 = require('./target1')${os.EOL}`
          )
        }))
  })

  it('should inject a statment with the correct syntax when the source type is `import`', () => {
    waitsForPromise(() =>
      textEditorRequire(editor, ['target1'], { type: 'import', pos: 0 })
        .then(() => {
          expect(editor.getText()).toBe(`import target1 from './target1'${os.EOL}`)
        }))
  })
})
