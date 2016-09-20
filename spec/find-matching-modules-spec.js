const path = require('path')
const findMatchingModules = require('../lib/find-matching-modules')
const mockProjectPath = require('./helpers/mock-project-path')
const config = require('../config')
const projectPath = path.join(mockProjectPath, 'walk')

describe('findMatchingModules function', () => {
  beforeEach(() => {
    atom.config.set('relative-require.excludeDirs', config.excludeDirs.default)
    atom.config.set('relative-require.omitExtensions', config.omitExtensions.default)
  })

  it('should find the expected module paths', () => {
    waitsForPromise(() =>
      findMatchingModules(projectPath, 'fooBar').then((modules) => {
        expect(modules.sort()).toEqual([
          path.join(projectPath, 'foo-bar.js'),
          path.join(projectPath, 'a', 'foo-bar.jsx'),
          path.join(projectPath, 'a', 'foo-bar.json'),
          path.join(projectPath, 'a', 'foo-bar.html'),
          path.join(projectPath, 'a', 'b', 'foo-bar.js'),
          path.join(projectPath, 'a', 'b', 'fooBar.js'),
          path.join(projectPath, 'a', 'b', 'foo_bar.js')
        ].sort())
      }))
  })

  it('should ignore excluded directories', () => {
    waitsForPromise(() =>
      findMatchingModules(projectPath, 'a').then((modules) => {
        expect(modules).toEqual([])
      }))
  })

  it('should find a module path if the module contains a valid index file', () => {
    waitsForPromise(() =>
      findMatchingModules(projectPath, 'good-index').then((modules) => {
        expect(modules).toEqual([
          path.join(projectPath, 'good-index', 'index.js')
        ])
      }))
  })

  it('should not find a module path if the module contains an invalid index file', () => {
    waitsForPromise(() =>
      findMatchingModules(projectPath, 'bad-index').then((modules) => {
        expect(modules).toEqual([])
      }))
  })
})
