'use babel'

import Q from 'q'
import fs from 'fs'
import path from 'path'
import { uniq } from 'ramda'
import { camelCase, kebabCase, snakeCase } from 'lodash'

const extensions = 'js|jsx|json'
const excludedDirs = /^\.|node_modules|bower_components/

const readDir = (dir) => Q.nfcall(fs.readdir, dir)

const isDir = (currPath) =>
  fs.lstatSync(currPath).isDirectory() && !path.parse(currPath).name.match(excludedDirs)

const validModuleNames = (m) => uniq([ m, camelCase(m), kebabCase(m), snakeCase(m) ])

const isMatch = (moduleName, item) => {
  const names = validModuleNames(moduleName).join('|')
  return item.match(new RegExp(`^(${names})\.(${extensions})$`))
}

export default (projectPath, moduleName) => {
  let results = []

  let next = (dir) => {
    return readDir(dir).then((list) =>
      Q.all(list.reduce((promises, item) => {
        let currPath = path.join(dir, item)
        if (isMatch(moduleName, item)) {
          results.push(currPath)
        } else if (isDir(currPath)) {
          promises.push(next(currPath))
        }
        return promises
      }, [])))
  }

  return next(projectPath).then(() => results)
}
