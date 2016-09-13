var R = require('ramda')
var path = require('path')
var readFile = require('./helpers').readFile

var extractDependencies = R.compose(R.flatten, R.map(R.keys), R.props(['dependencies', 'devDependencies']))

module.exports = function (projectPath) {
  return readFile(path.join(projectPath, 'package.json'))
      .then(JSON.parse)
      .then(extractDependencies)
}
