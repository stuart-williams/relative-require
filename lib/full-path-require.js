var _ = require('lodash')
var path = require('path')
var isDirectory = require('./helpers').isDirectory
var pathsToStatements = require('./statement-helpers').pathsToStatements
var injectStatements = require('./inject-statements')

module.exports = function (editor, modules, sourceInfo) {
  modules = _.reject(modules, isDirectory)
  if (!modules.length) return

  var activePath = path.parse(editor.getPath()).dir
  var statements = pathsToStatements(sourceInfo.type, activePath, modules)

  injectStatements(editor, sourceInfo.pos, statements)
}
