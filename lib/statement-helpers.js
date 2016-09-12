'use babel'

import path from 'path'
import { compose, map, uniq, curry } from 'ramda'
import { camelCase } from 'lodash'

const relativeizeModulePath = (activePath) => (modulePath) => {
  let relPath = path.relative(activePath, modulePath)
  return relPath.startsWith('.') ? relPath : `./${relPath}`
}

const getStatement = curry((type, varName, path) => type === 'import'
  ? `import ${varName} from '${path}'`
  : `const ${varName} = require('${path}')`)

const removeExt = (item) => {
  const ext = path.parse(item).ext
  const exts = atom.config.get('relative-require.omitExtensions')
  return ext.match(new RegExp(`\\.(${exts.join('|')})$`)) ? item.replace(new RegExp(`${ext}$`), '') : item
}

const pathToStatement = curry((type, activePath, modulePath) => {
  const varName = camelCase(path.parse(modulePath).name)
  const convert = compose(
    getStatement(type, varName),
    removeExt,
    relativeizeModulePath(activePath)
  )
  return convert(modulePath)
})

const pathsToStatements = (type, activePath, modulePaths) => uniq(map(pathToStatement(type, activePath), modulePaths))

export {
  getStatement,
  pathToStatement,
  pathsToStatements
}
