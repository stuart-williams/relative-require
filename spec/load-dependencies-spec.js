const path = require('path')
const loadDependencies = require('../lib/load-dependencies')
const projectPath = path.join(__dirname, 'mock-project')

describe('loadDependencies function', () => {
  it('should return an array of dependencies from the package.json in the project root', () => {
    waitsForPromise(() =>
      loadDependencies(projectPath).then((dependencies) => {
        expect(dependencies).toEqual(['foo', 'bar', 'baz'])
      }))
  })
})
