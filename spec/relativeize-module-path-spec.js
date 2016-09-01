var relativeizeModulePath = require('../lib/relativeize-module-path')

describe('relativeize module path function', () => {
  var relativeize = relativeizeModulePath('/foo/bar')

  it('should return the expected relative path to the module', () => {
    expect(relativeize('/foo/bar/mod.js')).toBe('./mod.js')
    expect(relativeize('/foo/mod.js')).toBe('../mod.js')
    expect(relativeize('/mod.js')).toBe('../../mod.js')
    expect(relativeize('/foo/bar/baz/mod.js')).toBe('./baz/mod.js')
  })
})
