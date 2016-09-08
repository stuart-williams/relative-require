'use babel'

import { compose, map, uniq, curry } from 'ramda'
import { camelCase } from 'lodash'
import path from 'path'

const relativeizeModulePath = (activePath) => (modPath) => {
  let relPath = path.relative(activePath, modPath)
  return relPath.startsWith('.') ? relPath : `./${relPath}`
}

const getStatement = curry((type, varName, path) => {
  return type === 'import'
    ? `import ${varName} from '${path}'`
    : `const ${varName} = require('${path}')`
})

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

const pathsToStatements = (type, activePath, modulePaths) => {
  const convert = compose(uniq, map(pathToStatement(type, activePath)))
  return convert(modulePaths)
}

export {
  getStatement,
  pathToStatement,
  pathsToStatements
}
