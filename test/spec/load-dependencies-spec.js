const loadDependencies = require('../../lib/load-dependencies')
const projectPath = require('../helpers/mock-project-path')

describe('loadDependencies function', () => {
  it('should return an array of dependencies from the package.json in the project root', () => {
    waitsForPromise(() =>
      loadDependencies(projectPath).then((dependencies) => {
        expect(dependencies).toEqual(['foo', 'bar', 'baz'])
      }))
  })
})
