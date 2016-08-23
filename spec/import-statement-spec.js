var importStatement = require('../lib/import-statement')

describe('import statement function', () => {
  it('should return the expected require statement when type is `require`', () => {
    expect(importStatement('require', 'foo', 'bar')).toBe('var foo = require(\'bar\')')
  })

  it('should return the expected import statement when type is `import`', () => {
    expect(importStatement('import', 'foo', 'bar')).toBe('import foo from \'bar\'')
  })
})
