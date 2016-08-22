'use babel'

import Q from 'q'
import fs from 'fs'
import path from 'path'
import { uniq } from 'lodash'

const extensions = 'js|jsx|json|coffee'
const excludedDirs = /^\.|node_modules|bower_components/

const readDir = (dir) => Q.nfcall(fs.readdir, dir)

const isDir = (currPath) => fs.lstatSync(currPath).isDirectory() &&
  !path.parse(currPath).name.match(excludedDirs)

const parsePath = (activePath) => (modPath) => {
  let relPath = path.relative(activePath, modPath)
  let ext = path.parse(modPath).ext
  return (relPath.startsWith('.') ? relPath : `./${relPath}`).replace(new RegExp(`${ext}$`), '')
}

const findMatchingModules = (projectPath, module) => {
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

export default (options) =>
  findMatchingModules(options.projectPath, options.module)
    .then((results) => uniq(results.map(parsePath(options.activePath))))
