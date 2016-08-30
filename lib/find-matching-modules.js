'use babel'

import Q from 'q'
import fs from 'fs'
import path from 'path'

const extensions = 'js|jsx|json'
const excludedDirs = /^\.|node_modules|bower_components/

const readDir = (dir) => Q.nfcall(fs.readdir, dir)

const isDir = (currPath) => fs.lstatSync(currPath).isDirectory() &&
  !path.parse(currPath).name.match(excludedDirs)

export default (projectPath, module) => {
  let isMatch = (item) => item.match(new RegExp(`^${module}\.(${extensions})$`))
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
