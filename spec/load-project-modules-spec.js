var path = require('path')
var loadProjectModules = require('../lib/load-project-modules')

var projectPath = path.join(__dirname, 'mock-project')
var activePath = path.join(__dirname, 'mock-project', 'b')

var options = {
  projectPath,
  module: 'foo',
  activePath
}

describe('load project modules function', () => {
  it('should return the expected deduped relative module paths', () => {
    waitsForPromise(() =>
      loadProjectModules(options).then((modules) => {
        expect(modules).toEqual([
          '../foo',
          '../a/foo',
          './foo'
        ])
      }))
  })
})
