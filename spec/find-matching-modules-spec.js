const path = require('path')
const mockProjectPath = require('./helpers/mock-project-path')
const findMatchingModules = require('../lib/find-matching-modules')

describe('findMatchingModules function', () => {
  it('should find the expected module paths', () => {
    waitsForPromise(() =>
      findMatchingModules(mockProjectPath, ['fooBar']).then((modules) => {
        expect(modules.sort()).toEqual([
          path.join(mockProjectPath, 'foo-bar.js'),
          path.join(mockProjectPath, 'foo-bar.json'),
          path.join(mockProjectPath, 'one', 'fooBar.jsx'),
          path.join(mockProjectPath, 'one', 'two', 'foo_bar.js'),
          path.join(mockProjectPath, 'one', 'two', 'three', 'foo-bar.js')
        ].sort())
      }))
  })

  it('should find the expected module paths when supplied with multiple modules', () => {
    waitsForPromise(() =>
      findMatchingModules(mockProjectPath, ['fooBar', 'barBaz']).then((modules) => {
        expect(modules.sort()).toEqual([
          path.join(mockProjectPath, 'foo-bar.js'),
          path.join(mockProjectPath, 'bar-baz.js'),
          path.join(mockProjectPath, 'foo-bar.json'),
          path.join(mockProjectPath, 'one', 'fooBar.jsx'),
          path.join(mockProjectPath, 'one', 'barBaz.js'),
          path.join(mockProjectPath, 'one', 'two', 'foo_bar.js'),
          path.join(mockProjectPath, 'one', 'two', 'three', 'foo-bar.js')
        ].sort())
      }))
  })
})
