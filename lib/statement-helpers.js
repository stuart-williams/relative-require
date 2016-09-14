var _ = require('lodash')
var npath = require('path')
var shouldOmitExtension = require('./helpers').shouldOmitExtension

var relativeize = function (activePath, modulePath) {
  var path = npath.relative(activePath, modulePath)
  return _.startsWith(path, '.') ? path : './' + path
}

var omitExtension = function (item) {
  return shouldOmitExtension(item) ? _.trimEnd(item, npath.parse(item).ext) : item
}

var getStatement = function (type, varName, path) {
  switch (type) {
    case 'import': return 'import ' + varName + ' from \'' + path + '\''
    case 'require': return 'const ' + varName + ' = require(\'' + path + '\')'
  }
}

var pathToStatement = _.curry(function (type, activePath, modulePath) {
  var varName = _.camelCase(npath.parse(modulePath).name)
  var path = omitExtension(relativeize(activePath, modulePath))
  return getStatement(type, varName, path)
})

var pathsToStatements = function (type, activePath, modulePaths) {
  return _.uniq(_.map(modulePaths, pathToStatement(type, activePath)))
}

module.exports = {
  getStatement: getStatement,
  pathToStatement: pathToStatement,
  pathsToStatements: pathsToStatements
}
