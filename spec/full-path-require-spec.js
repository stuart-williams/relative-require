const path = require('path')
const os = require('os')
const mockProjectPath = require('./helpers/mock-project-path')
const fullPathRequire = require('../lib/full-path-require')
const config = require('../config')
const projectPath = path.join(mockProjectPath, 'editor')

describe('fullPathRequire function', () => {
  let editor = null

  beforeEach(() => {
    atom.config.set('relative-require.omitExtensions', config.omitExtensions.default)
    waitsForPromise(() => atom.workspace.open(path.join(projectPath, 'active.js')).then((e) => {
      editor = e
    }))
  })

  it('should inject the correct statment when source type is `require`', () => {
    fullPathRequire(editor, [
      path.join(projectPath, 'target1.js'),
      path.join(projectPath, 'target2.jsx'),
      path.join(projectPath, 'target3.json')
    ], {
      type: 'require',
      pos: 0
    })
    expect(editor.getText()).toBe(
      `const target1 = require('./target1')${os.EOL}const target2 = require('./target2')${os.EOL}const target3 = require('./target3')${os.EOL}`
    )
  })

  it('should inject the correct statment when source type is `import`', () => {
    fullPathRequire(editor, [
      path.join(projectPath, 'target1.js'),
      path.join(projectPath, 'target2.jsx'),
      path.join(projectPath, 'target3.json')
    ], {
      type: 'import',
      pos: 0
    })
    expect(editor.getText()).toBe(
      `import target1 from './target1'${os.EOL}import target2 from './target2'${os.EOL}import target3 from './target3'${os.EOL}`
    )
  })
})
