const config = require('../config')

describe('pathToStatement function', () => {
  const convert = require('../lib/statement-helpers').pathToStatement

  beforeEach(() => {
    atom.config.set('relative-require.omitExtensions', config.omitExtensions.default)
  })

  describe('with type `require`', () => {
    it('should create the expected relative require statement', () => {
      expect(convert('require', '/foo')('/foo/bar.js')).toBe('const bar = require(\'./bar\')')
      expect(convert('require', '/foo/bar')('/foo/bar.js')).toBe('const bar = require(\'../bar\')')
      expect(convert('require', '/foo/bar')('/foo/baz/bar.js')).toBe('const bar = require(\'../baz/bar\')')
    })
    it('should camelCase the variable name', () => {
      expect(convert('require', '/foo')('/foo/bar-baz.js')).toBe('const barBaz = require(\'./bar-baz\')')
    })
  })

  describe('with type `import`', () => {
    it('should create the expected relative import statement', () => {
      expect(convert('import', '/foo')('/foo/bar.js')).toBe('import bar from \'./bar\'')
      expect(convert('import', '/foo/bar')('/foo/bar.js')).toBe('import bar from \'../bar\'')
      expect(convert('import', '/foo/bar')('/foo/baz/bar.js')).toBe('import bar from \'../baz/bar\'')
    })
    it('should camelCase the variable name', () => {
      expect(convert('import', '/foo')('/foo/bar-baz.js')).toBe('import barBaz from \'./bar-baz\'')
    })
  })
})

describe('pathsToStatements function', () => {
  const convert = require('../lib/statement-helpers').pathsToStatements

  beforeEach(() => {
    atom.config.set('relative-require.omitExtensions', config.omitExtensions.default)
  })

  it('should dedupe modules with the same path after removal of extension', () => {
    expect(convert('require', '/foo', [ '/foo/bar.js', '/foo/bar.jsx', '/foo/bar.json', '/foo/baz.js' ])).toEqual([
      'const bar = require(\'./bar\')',
      'const bar = require(\'./bar.json\')',
      'const baz = require(\'./baz\')'
    ])
  })
})
