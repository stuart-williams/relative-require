var _ = require('lodash')
var fs = require('fs')

module.exports = {
  isDirectory: function (path) {
    return fs.lstatSync(path).isDirectory()
  },
  caseify: function (m) {
    return _.uniq([ m, _.camelCase(m), _.kebabCase(m), _.snakeCase(m) ])
  },
  shouldOmitExtension: function (path) {
    var omitExtensions = atom.config.get('relative-require.omitExtensions')
    return omitExtensions.some(function (ext) {
      return path.match(new RegExp('\\.' + ext + '$'))
    })
  }
}
