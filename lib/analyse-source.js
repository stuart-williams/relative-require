'use babel'

import types from 'ast-types'
const acorn = require('acorn')

const acornOptions = {
  ecmaVersion: 6,
  sourceType: 'module'
}

const isRequire = (node) => node.callee.type === 'Identifier' && node.callee.name === 'require'
const isUseStatement = (node) => node && node.type === 'ExpressionStatement' && node.expression.value.startsWith('use')

export default (src) => {
  const ast = acorn.parse(src, acornOptions)
  let res = { require: 0, import: 0, pos: isUseStatement(ast.body[0]) ? ast.body[0].end : 0 }

  types.visit(ast, {
    visitImportDeclaration (p) {
      res.pos = p.value.end
      res.import += 1
      this.traverse(p)
    },
    visitCallExpression (p) {
      if (!isRequire(p.node)) return false
      res.pos = p.value.end
      res.require += 1
      this.traverse(p)
    }
  })

  return {
    type: res.require >= res.import ? 'require' : 'import',
    pos: res.pos
  }
}
