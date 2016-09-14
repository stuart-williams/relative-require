var _ = require('lodash')
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

  var mergebuiltinModules = function (dependencies) {
    return dependencies.concat(builtinModules)
  }

  var getDependencyStatements = function (dependencies) {
    var intersect = _.intersection(dependencies, caseify(module))
    if (!intersect.length) return
    return getStatement(sourceInfo.type, _.camelCase(module), intersect[0])
  }

  var getProjectModuleStatements = function (paths) {
    switch (paths.length) {
      case 0: return []
      case 1: return pathsToStatements(sourceInfo.type, activePath, paths)
    }
    showFileListView(paths)
    return []
  }

  var loadProjectModules = function (statement) {
    if (statement) return [ statement ]
    return findMatchingModules(projectPath, module).then(getProjectModuleStatements)
  }

  return loadDependencies(projectPath)
    .then(mergebuiltinModules)
    .then(getDependencyStatements)
    .then(loadProjectModules)
    .then(injectStatements(editor, sourceInfo.pos))
}
