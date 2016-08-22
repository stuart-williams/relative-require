'use babel'

import Q from 'q'
import fs from 'fs'
import path from 'path'

let readDir = (dir) => Q.nfcall(fs.readdir, dir)
let isDir = (currPath) => fs.lstatSync(currPath).isDirectory() &&
  !path.parse(currPath).name.match(/^\.|node_modules|bower_components/)

export default (projectPath, module) => {
  let isMatch = (item) => item.match(new RegExp(`^${module}\.(js|jsx|json|coffee)$`))
  let results = []

  let next = (dir) => {
    return readDir(dir).then((list) =>
      Q.all(list.reduce((promises, item) => {
        let currPath = path.join(dir, item)
        if (isMatch(item)) {
          results.push(currPath)
        } else if (isDir(currPath)) {
          promises.push(next(currPath))
        }
        return promises
      }, [])))
  }

  return next(projectPath).then(() => results)
}
