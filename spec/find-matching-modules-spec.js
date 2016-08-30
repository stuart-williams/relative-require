var path = require('path')
var findMatchingModules = require('../lib/find-matching-modules')
var projectPath = path.join(__dirname, 'mock-project')

describe('find matching modules function', () => {
  it('should find the expected module paths', () => {
    waitsForPromise(() =>
      findMatchingModules(projectPath, 'foo').then((modules) => {
        expect(modules).toEqual([
          path.join(projectPath, 'foo.jsx'),
          path.join(projectPath, 'a/foo.js'),
          path.join(projectPath, 'a/foo.json'),
          path.join(projectPath, 'b/foo.json')
        ])
      }))
  })
})
