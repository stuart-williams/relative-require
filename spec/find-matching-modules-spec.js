const path = require('path')
const findMatchingModules = require('../lib/find-matching-modules')
const projectPath = path.join(__dirname, 'mock-project')

describe('findMatchingModules function', () => {
  it('should find the expected module paths', () => {
    waitsForPromise(() =>
      findMatchingModules(projectPath, 'foo').then((modules) => {
        expect(modules.sort()).toEqual([
          path.join(projectPath, 'foo.jsx'),
          path.join(projectPath, 'a/foo.js'),
          path.join(projectPath, 'a/foo.json'),
          path.join(projectPath, 'b/foo.json')
        ].sort())
      }))
  })
})
