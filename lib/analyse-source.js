var acorn = require('acorn')
var astTypes = require('ast-types')

var acornOptions = {
  ecmaVersion: 6,
  sourceType: 'module'
}

var isRequire = function (node) {
  return node.callee.type === 'Identifier' && node.callee.name === 'require'
}

module.exports = function (src) {
  var ast = null
  var res = { require: 0, import: 0, pos: 0 }

  try {
    ast = acorn.parse(src, acornOptions)
  } catch (e) {
    return { type: 'require', pos: 0 }
  }

  astTypes.visit(ast, {
    visitImportDeclaration: function (p) {
      res.pos = p.value.end
      res.import += 1
      this.traverse(p)
    },
    visitCallExpression: function (p) {
      if (!isRequire(p.node)) return false
      res.pos = p.value.end
      res.require += 1
      this.traverse(p)
    }
  })

  return { type: res.require >= res.import ? 'require' : 'import', pos: res.pos }
}
