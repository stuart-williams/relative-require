var Q = require('q')
var npath = require('path')
var walk = require('walkdir')
var isDirectory = require('./helpers').isDirectory
var caseify = require('./helpers').caseify

var dontWalkDirectory = function (path) {
  var exclude = atom.config.get('relative-require.excludeDirs')
  return isDirectory(path) && exclude.some(function (p) {
    return npath.basename(path).match(new RegExp(p))
  })
}

module.exports = function (projectPath, module) {
  return Q.promise(function (resolve) {
    var isMatch = new RegExp(`^(${caseify(module).join('|')})\\..*$`)
    var results = []

    var walker = walk(projectPath, { follow_symlinks: false }, function (path) {
      if (dontWalkDirectory(path)) walker.ignore(path)
    })

    walker.on('file', function (path, stat) {
      if (npath.basename(path).match(isMatch)) {
        results.push(path)
      }
    })

    walker.on('end', function () {
      return resolve(results)
    })
  })
}
