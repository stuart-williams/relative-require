'use babel'

import Q from 'q'
import path from 'path'
import builtinModules from 'builtin-modules'
import { camelCase } from 'lodash'
import { intersection, concat } from 'ramda'
import { getStatement, pathsToStatements } from './statement-helpers'
import { caseify } from './helpers'
import findMatchingModules from './find-matching-modules'
import loadDependencies from './load-dependencies'
import injectStatements from './inject-statements'
import FileListView from './file-list-view'
import fullPathRequire from './full-path-require'

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
      const intersect = intersection(dependencies, caseify(module))
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
    loadDependencies(projectPath).then(concat(builtinModules)).then(onLoadedDependencies),
    findMatchingModules(projectPath, modules).then(onFoundMatchingModules)
  ])
  .then(injectStatements(editor, sourceInfo.pos))
  .catch((e) => {
    throw new Error(e)
  })
}
