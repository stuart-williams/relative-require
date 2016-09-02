'use babel'

import fs from 'fs'
import Q from 'q'
import types from 'ast-types'
const acorn = require('acorn')

const acornOptions = {
  ecmaVersion: 6,
  sourceType: 'module'
}

const readFile = (filePath) => Q.nfcall(fs.readFile, filePath, 'utf8')
const isRequire = (node) => node.callee.type === 'Identifier' && node.callee.name === 'require'

export default (filePath) => readFile(filePath)
  .then((src) => {
    const ast = acorn.parse(src, acornOptions)
    let results = { require: 0, import: 0 }

    types.visit(ast, {
      visitImportDeclaration (p) {
        results.import += 1
        this.traverse(p)
      },
      visitCallExpression (p) {
        if (!isRequire(p.node)) return false
        results.require += 1
        this.traverse(p)
      }
    })

    return results.require >= results.import ? 'require' : 'import'
  })
