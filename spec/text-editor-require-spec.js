const path = require('path')
const os = require('os')
const textEditorRequire = require('../lib/text-editor-require')
const mockProjectPath = require('./helpers/mock-project-path')
const config = require('../config')
const projectPath = path.join(mockProjectPath, 'editor')

describe('textEditorRequire function', () => {
  atom.project.relativizePath = () => [ projectPath ]

  let editor = null

  beforeEach(() => {
    atom.config.set('relative-require.omitExtensions', config.omitExtensions.default)
    atom.config.set('relative-require.excludeDirs', config.excludeDirs.default)
    waitsForPromise(() => atom.workspace.open(path.join(projectPath, 'active.js')).then((e) => {
      editor = e
    }))
  })

  it('should inject a statment with the correct syntax when the source type is `require`', () => {
    waitsForPromise(() =>
      textEditorRequire(editor, ['target1'], { type: 'require', pos: 0 })
        .then(() => {
          expect(editor.getText()).toBe(`const target1 = require('./target1')${os.EOL}`)
        }))
  })

  it('should inject a statment with the correct syntax when the source type is `import`', () => {
    waitsForPromise(() =>
      textEditorRequire(editor, ['target1'], { type: 'import', pos: 0 })
        .then(() => {
          expect(editor.getText()).toBe(`import target1 from './target1'${os.EOL}`)
        }))
  })

  it('should inject the correct statment for a package.json dependency', () => {
    waitsForPromise(() =>
      textEditorRequire(editor, ['foo'], { type: 'require', pos: 0 })
        .then(() => {
          expect(editor.getText()).toBe(`const foo = require('foo')${os.EOL}`)
        }))
  })

  it('should inject the correct statment for a native node module', () => {
    waitsForPromise(() =>
      textEditorRequire(editor, ['path'], { type: 'require', pos: 0 })
        .then(() => {
          expect(editor.getText()).toBe(`const path = require('path')${os.EOL}`)
        }))
  })
})
