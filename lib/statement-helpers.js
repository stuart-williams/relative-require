'use babel'

import npath from 'path'
import { compose, map, uniq, curry } from 'ramda'
import { camelCase } from 'lodash'

const relativeize = (activePath) => (modulePath) => {
  const path = npath.relative(activePath, modulePath)
  return path.startsWith('.') ? path : `./${path}`
}

const omitExtension = (item) => {
  const omitExtensions = atom.config.get('relative-require.omitExtensions')
  const matched = omitExtensions.some((e) => item.endsWith(`.${e}`))
  return matched ? item.replace(new RegExp(`${npath.parse(item).ext}$`), '') : item
}

const getStatement = curry((type, varName, path) => {
  switch (type) {
    case 'import': return `import ${varName} from '${path}'`
    case 'require': return `const ${varName} = require('${path}')`
  }
})

const pathToStatement = curry((type, activePath, modulePath) => {
  const varName = camelCase(npath.parse(modulePath).name)
  const convert = compose(getStatement(type, varName), omitExtension, relativeize(activePath))
  return convert(modulePath)
})

const pathsToStatements = (type, activePath, modulePaths) =>
  uniq(map(pathToStatement(type, activePath), modulePaths))

export {
  getStatement,
  pathToStatement,
  pathsToStatements
}
