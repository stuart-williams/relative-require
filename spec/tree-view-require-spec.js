const path = require('path')
const os = require('os')
const mockProjectPath = require('./helpers/mock-project-path')
const treeViewRequire = require('../lib/tree-view-require')
const projectPath = path.join(mockProjectPath, 'editor')

describe('context menu require', () => {
  let editor = null

  beforeEach(() => {
    waitsForPromise(() => atom.workspace.open(path.join(projectPath, 'active.js')).then((e) => {
      editor = e
    }))
  })

  it('should inject the correct statment when source type is `require`', () => {
    treeViewRequire(editor, [
      path.join(projectPath, 'target1')
    ], {
      type: 'require',
      pos: 0
    })
    expect(editor.getText()).toBe(`const target1 = require('./target1')${os.EOL}`)
  })

  it('should inject the correct statment when source type is `import`', () => {
    treeViewRequire(editor, [
      path.join(projectPath, 'target1')
    ], {
      type: 'import',
      pos: 0
    })
    expect(editor.getText()).toBe(`import target1 from './target1'${os.EOL}`)
  })
})
