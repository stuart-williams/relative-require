const path = require('path')
const findMatchingModules = require('../lib/find-matching-modules')
const projectPath = require('./helpers/mock-project-path')

describe('findMatchingModules function', () => {
  it('should find the expected module paths', () => {
    waitsForPromise(() =>
      findMatchingModules(projectPath, ['fooBar']).then((modules) => {
        expect(modules.sort()).toEqual([
          path.join(projectPath, 'foo-bar.js'),
          path.join(projectPath, 'foo-bar.json'),
          path.join(projectPath, 'one', 'fooBar.jsx'),
          path.join(projectPath, 'one', 'two', 'foo_bar.js'),
          path.join(projectPath, 'one', 'two', 'three', 'foo-bar.js')
        ].sort())
      }))
  })

  it('should find the expected module paths when supplied with multiple modules', () => {
    waitsForPromise(() =>
      findMatchingModules(projectPath, ['fooBar', 'barBaz']).then((modules) => {
        expect(modules.sort()).toEqual([
          path.join(projectPath, 'foo-bar.js'),
          path.join(projectPath, 'bar-baz.js'),
          path.join(projectPath, 'foo-bar.json'),
          path.join(projectPath, 'one', 'fooBar.jsx'),
          path.join(projectPath, 'one', 'barBaz.js'),
          path.join(projectPath, 'one', 'two', 'foo_bar.js'),
          path.join(projectPath, 'one', 'two', 'three', 'foo-bar.js')
        ].sort())
      }))
  })
})
