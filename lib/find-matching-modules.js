var Q = require('q')
var _ = require('lodash')
var npath = require('path')
var walk = require('walkdir')
var isDirectory = require('./helpers').isDirectory
var caseify = require('./helpers').caseify
var shouldOmitExtension = require('./helpers').shouldOmitExtension

var dontWalkDirectory = function (path) {
  var exclude = atom.config.get('relative-require.excludeDirs')
  return isDirectory(path) && exclude.some(function (p) {
    return npath.basename(path).match(new RegExp(p))
  })
}

var indexDirModule = function (path, isMatch) {
  var info = npath.parse(path)
  var modulePath = _.last(info.dir.split(npath.sep)) + info.ext
  return shouldOmitExtension(path) && path.match(/index\..*$/) && modulePath.match(isMatch)
}

module.exports = function (projectPath, module) {
  return Q.promise(function (resolve) {
    var isMatch = new RegExp('^(' + caseify(module).join('|') + ')\\..*$')
    var results = []

    var walker = walk(projectPath, { follow_symlinks: false }, function (path) {
      if (dontWalkDirectory(path)) walker.ignore(path)
    })

    walker.on('file', function (path, stat) {
      if (npath.basename(path).match(isMatch) || indexDirModule(path, isMatch)) {
        results.push(path)
      }
    })

    walker.on('end', function () {
      resolve(results)
    })
  })
}
