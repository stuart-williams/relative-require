'use babel'

import Q from 'q'
import { camelCase, kebabCase, snakeCase } from 'lodash'
import { uniq, intersection } from 'ramda'
import path from 'path'
import loadDependencies from './load-dependencies'
import findMatchingModules from './find-matching-modules'
import { getStatement, pathsToStatements } from './path-to-statement'
import injectStatements from './inject-statements'
import builtinModules from 'builtin-modules'

const validModuleNames = (m) => uniq([ m, camelCase(m), kebabCase(m), snakeCase(m) ])

const getModuleStatements = (editor, type, modules) => (dependencies) => {
  return modules.reduce((out, module) => {
    const intersect = intersection(dependencies, validModuleNames(module))
    return intersect.length ? out.concat(getStatement(type, camelCase(module), intersect[0])) : out
  }, [])
}

const getProjectModuleStatements = (editor, type, activePath) => (modulePaths) => {
  if (!modulePaths.length) return []
  return pathsToStatements(type, activePath, modulePaths)
}

export default (editor, modules, sourceInfo) => {
  const activePath = path.parse(editor.getPath()).dir
  const [ projectPath ] = atom.project.relativizePath(activePath)

  return Q.all([
    loadDependencies(projectPath)
      .then((dependencies) => dependencies.concat(builtinModules))
      .then(getModuleStatements(editor, sourceInfo.type, modules)),
    findMatchingModules(projectPath, modules)
      .then(getProjectModuleStatements(editor, sourceInfo.type, activePath))
  ])
  .then(injectStatements(editor, sourceInfo.pos))
  .catch((e) => {
    throw new Error(e)
  })
}
