var path = require('path')
var loadDependencies = require('../lib/load-dependencies')
var projectPath = path.join(__dirname, 'mock-project')

describe('load dependencies function', () => {
  it('should return an array of dependencies from the package.json in the project root', () => {
    waitsForPromise(() =>
      loadDependencies(projectPath).then((dependencies) => {
        expect(dependencies).toEqual(['foo', 'bar', 'baz'])
      }))
  })
})
