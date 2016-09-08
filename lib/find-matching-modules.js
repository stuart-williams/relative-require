'use babel'

import Q from 'q'
import fs from 'fs'
import path from 'path'
import { compose, map, flatten, uniq, join } from 'ramda'
import { camelCase, kebabCase, snakeCase } from 'lodash'

const excludedDirs = /^\.|node_modules|bower_components/

const readDir = (dir) => Q.nfcall(fs.readdir, dir)
const isDir = (currPath) =>
  fs.lstatSync(currPath).isDirectory() && !path.parse(currPath).name.match(excludedDirs)

const validModuleNames = (m) => uniq([ m, camelCase(m), kebabCase(m), snakeCase(m) ])
const moduleNames = compose(join('|'), flatten, map(validModuleNames))

export default (projectPath, modules) => {
  const moduleNamesRegex = new RegExp(`^(${moduleNames(modules)})\\..*$`)
  let results = []

  let next = (dir) => {
    return readDir(dir).then((list) =>
      Q.all(list.reduce((promises, item) => {
        let currPath = path.join(dir, item)
        if (item.match(moduleNamesRegex)) {
          results.push(currPath)
        } else if (isDir(currPath)) {
          promises.push(next(currPath))
        }
        return promises
      }, [])))
  }

  return next(projectPath).then(() => results)
}
