'use babel'

import { compose, map, uniq } from 'ramda'
import { camelCase } from 'lodash'
import path from 'path'

const relativeizeModulePath = (activePath) => (modPath) => {
  let relPath = path.relative(activePath, modPath)
  return relPath.startsWith('.') ? relPath : `./${relPath}`
}

const statement = (type, varName) => (path) => {
  return type === 'import'
    ? `import ${varName} from '${path}'`
    : `var ${varName} = require('${path}')`
}

const removeExt = (item) => item.replace(new RegExp(`${path.parse(item).ext}$`), '')

const convertPathToStatement = (type, activePath) => (modulePath) => {
  const varName = camelCase(path.parse(modulePath).name)
  const convert = compose(
    statement(type, varName),
    removeExt,
    relativeizeModulePath(activePath)
  )
  return convert(modulePath)
}

const convertPathsToStatements = (type, activePath, modulePaths) => {
  const convert = compose(uniq, map(convertPathToStatement(type, activePath)))
  return convert(modulePaths)
}

export {
  convertPathToStatement,
  convertPathsToStatements
}
