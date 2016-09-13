var R = require('ramda')
var _ = require('lodash/string')
var npath = require('path')

var relativeize = function (activePath) {
  return function (modulePath) {
    var path = npath.relative(activePath, modulePath)
    return path.startsWith('.') ? path : `./${path}`
  }
}

var omitExtension = function (item) {
  var omitExtensions = atom.config.get('relative-require.omitExtensions')
  var matched = omitExtensions.some(function (e) {
    return item.endsWith(`.${e}`)
  })
  return matched ? item.replace(new RegExp(`${npath.parse(item).ext}$`), '') : item
}

var getStatement = R.curry(function (type, varName, path) {
  switch (type) {
    case 'import': return `import ${varName} from '${path}'`
    case 'require': return `const ${varName} = require('${path}')`
  }
})

var pathToStatement = R.curry(function (type, activePath, modulePath) {
  var varName = _.camelCase(npath.parse(modulePath).name)
  var convert = R.compose(getStatement(type, varName), omitExtension, relativeize(activePath))
  return convert(modulePath)
})

var pathsToStatements = function (type, activePath, modulePaths) {
  return R.uniq(R.map(pathToStatement(type, activePath), modulePaths))
}

module.exports = {
  getStatement: getStatement,
  pathToStatement: pathToStatement,
  pathsToStatements: pathsToStatements
}
