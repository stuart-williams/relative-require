'use babel'

import path from 'path'
import { compose, map, uniq, curry } from 'ramda'
import { camelCase } from 'lodash'

const relativeizeModulePath = (activePath) => (modulePath) => {
  const relPath = path.relative(activePath, modulePath)
  return relPath.startsWith('.') ? relPath : `./${relPath}`
}

const omitExtension = (item) => {
  const omitExtensions = atom.config.get('relative-require.omitExtensions')
  const matched = omitExtensions.some((e) => item.endsWith(`.${e}`))
  return matched ? item.replace(new RegExp(`${path.parse(item).ext}$`), '') : item
}

const getStatement = curry((type, varName, path) => type === 'import'
  ? `import ${varName} from '${path}'`
  : `const ${varName} = require('${path}')`)

const pathToStatement = curry((type, activePath, modulePath) => {
  const varName = camelCase(path.parse(modulePath).name)
  const convert = compose(getStatement(type, varName), omitExtension, relativeizeModulePath(activePath))
  return convert(modulePath)
})

const pathsToStatements = (type, activePath, modulePaths) =>
  uniq(map(pathToStatement(type, activePath), modulePaths))

export {
  getStatement,
  pathToStatement,
  pathsToStatements
}
