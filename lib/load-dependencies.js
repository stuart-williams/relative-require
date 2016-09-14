var Q = require('q')
var fs = require('fs')
var path = require('path')
var keys = Object.keys

module.exports = function (projectPath) {
  return Q.promise((resolve) => {
    fs.readFile(path.join(projectPath, 'package.json'), 'utf8', (error, data) => {
      if (error) return resolve([])
      data = JSON.parse(data)
      resolve(keys(data.dependencies || {}).concat(keys(data.devDependencies || {})))
    })
  })
}
