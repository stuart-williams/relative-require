var path = require('path')
var findMatchingModules = require('../lib/find-matching-modules')
var projectPath = path.join(__dirname, 'mock-project')

describe('findMatchingModules function', () => {
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
  it('should match files using camel, kebab and snake case', () => {
    const casesPath = path.join(projectPath, 'cases')

    waitsForPromise(() =>
      findMatchingModules(casesPath, 'fooBar').then((modules) => {
        expect(modules).toEqual([
          path.join(casesPath, 'foo-bar.js'),
          path.join(casesPath, 'fooBar.js'),
          path.join(casesPath, 'foo_bar.js')
        ])
      }))
  })
})
