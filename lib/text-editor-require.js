'use babel'

import npath from 'path'
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

export default (editor, module, sourceInfo) => {
  const activePath = npath.parse(editor.getPath()).dir
  const [ projectPath ] = atom.project.relativizePath(activePath)

  const showFileListView = (paths) => {
    const items = paths.map((path) => ({ name: path.replace(projectPath, ''), path: path }))
    const view = new FileListView(items)
    view.on('confirmed', (e, item) => fullPathRequire(editor, [item.path], sourceInfo))
  }

  const onLoadedDependencies = (dependencies) => {
    const intersect = intersection(dependencies, caseify(module))
    if (!intersect.length) return
    return getStatement(sourceInfo.type, camelCase(module), intersect[0])
  }

  const onFoundMatchingModules = (paths) => {
    switch (paths.length) {
      case 0: return []
      case 1: return pathsToStatements(sourceInfo.type, activePath, paths)
    }
    showFileListView(paths)
    return []
  }

  return loadDependencies(projectPath)
    .then(concat(builtinModules))
    .then(onLoadedDependencies)
    .then((statement) => {
      if (statement) return [ statement ]
      return findMatchingModules(projectPath, module)
        .then(onFoundMatchingModules)
    })
    .then(injectStatements(editor, sourceInfo.pos))
    .catch((e) => {
      throw new Error(e)
    })
}
