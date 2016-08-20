'use babel'

import R from 'ramda'
import Q from 'q'
import fs from 'fs'
import path from 'path'

let readDir = (dir) => Q.nfcall(fs.readdir, dir)
let isDir = (path) => fs.lstatSync(path).isDirectory() && !R.match(/^\.|node_modules|bower_components/, path).length

export default (projectRoot, mod) => {
  let isMatch = (item) => item.match(new RegExp(`${mod}.js*`))
  let results = []

  let next = (dir) => {
    return readDir(dir).then((list) => Q.all(list.reduce((promises, item) => {
      let currPath = path.join(dir, item)
      if (isMatch(item)) {
        results.push(currPath)
      } else if (isDir(currPath)) {
        promises.push(next(currPath))
      }
      return promises
    }, [])))
  }

  return next(projectRoot).then(() => results)
}
