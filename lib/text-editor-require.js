var R = require('ramda')
var _ = require('lodash/string')
var npath = require('path')
var builtinModules = require('builtin-modules')
var FileListView = require('./file-list-view')
var fullPathRequire = require('./full-path-require')
var loadDependencies = require('./load-dependencies')
var findMatchingModules = require('./find-matching-modules')
var injectStatements = require('./inject-statements')
var pathsToStatements = require('./statement-helpers').pathsToStatements
var getStatement = require('./statement-helpers').getStatement
var caseify = require('./helpers').caseify

module.exports = function (editor, module, sourceInfo) {
  var activePath = npath.parse(editor.getPath()).dir
  var projectPath = atom.project.relativizePath(activePath)[0]

  var showFileListView = function (paths) {
    var items = paths.map(function (path) {
      return {
        name: path.replace(projectPath, ''),
        path: path
      }
    })
    var view = new FileListView(items)
    view.on('confirmed', function (e, item) {
      return fullPathRequire(editor, [item.path], sourceInfo)
    })
  }

  var onLoadedDependencies = function (dependencies) {
    var intersect = R.intersection(dependencies, caseify(module))
    if (!intersect.length) return
    return getStatement(sourceInfo.type, _.camelCase(module), intersect[0])
  }

  var onFoundMatchingModules = function (paths) {
    switch (paths.length) {
      case 0: return []
      case 1: return pathsToStatements(sourceInfo.type, activePath, paths)
    }
    showFileListView(paths)
    return []
  }

  return loadDependencies(projectPath)
    .then(R.concat(builtinModules))
    .then(onLoadedDependencies)
    .then(function (statement) {
      if (statement) return [ statement ]
      return findMatchingModules(projectPath, module)
        .then(onFoundMatchingModules)
    })
    .then(injectStatements(editor, sourceInfo.pos))
    .catch(function (e) {
      throw new Error(e)
    })
}
