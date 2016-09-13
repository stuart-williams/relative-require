var Q = require('q')
var R = require('ramda')
var _ = require('lodash/string')
var fs = require('fs')

module.exports = {
  isDirectory: function (path) {
    return fs.lstatSync(path).isDirectory()
  },
  caseify: function (m) {
    return R.uniq([ m, _.camelCase(m), _.kebabCase(m), _.snakeCase(m) ])
  },
  readFile: function (path) {
    return Q.nfcall(fs.readFile, path, 'utf8')
  }
}
