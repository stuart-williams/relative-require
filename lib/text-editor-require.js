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
import FileListView from './file-list-view'
import fullPathRequire from './full-path-require'

const validModuleNames = (m) => uniq([ m, camelCase(m), kebabCase(m), snakeCase(m) ])

export default (editor, modules, sourceInfo) => {
  const activePath = path.parse(editor.getPath()).dir
  const [ projectPath ] = atom.project.relativizePath(activePath)

  const showFileListView = (modulePaths) => {
    const items = modulePaths.map((modulePath) => ({
      name: modulePath.replace(projectPath, ''),
      path: modulePath
    }))
    const view = new FileListView(items)
    view.on('confirmed', (e, item) => fullPathRequire(editor, [item.path], sourceInfo))
  }

  const onLoadedDependencies = (dependencies) => {
    return modules.reduce((out, module) => {
      const intersect = intersection(dependencies, validModuleNames(module))
      return intersect.length ? out.concat(getStatement(sourceInfo.type, camelCase(module), intersect[0])) : out
    }, [])
  }

  const onFoundMatchingModules = (modulePaths) => {
    if (!modulePaths.length) return []
    if (modulePaths.length === 1) {
      return pathsToStatements(sourceInfo.type, activePath, modulePaths)
    }
    showFileListView(modulePaths)
    return []
  }

  return Q.all([
    loadDependencies(projectPath).then((dependencies) => dependencies.concat(builtinModules)).then(onLoadedDependencies),
    findMatchingModules(projectPath, modules).then(onFoundMatchingModules)
  ])
  .then(injectStatements(editor, sourceInfo.pos))
  .catch((e) => {
    throw new Error(e)
  })
}
