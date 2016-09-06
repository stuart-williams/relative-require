const path = require('path')
const os = require('os')
const mockProjectPath = require('./helpers/mock-project-path')
const contextMenuRequire = require('../lib/context-menu-require')
const projectPath = path.join(mockProjectPath, 'editor')

describe('context menu require', () => {
  let editor = null

  beforeEach(() => {
    waitsForPromise(() => atom.workspace.open(path.join(projectPath, 'active.js')).then((e) => {
      editor = e
    }))
  })

  it('should inject the correct statment when source type is `require`', () => {
    contextMenuRequire(editor, [
      path.join(projectPath, 'target1')
    ], {
      type: 'require',
      pos: 0
    })
    expect(editor.getText()).toBe(`${os.EOL}const target1 = require('./target1')`)
  })

  it('should inject the correct statment when source type is `import`', () => {
    contextMenuRequire(editor, [
      path.join(projectPath, 'target1')
    ], {
      type: 'import',
      pos: 0
    })
    expect(editor.getText()).toBe(`${os.EOL}import target1 from './target1'`)
  })
})
