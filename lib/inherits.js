module.exports = function (child, parent) {
  for (var key in parent) {
    if (parent.hasOwnProperty(key)) child[key] = parent[key]
  }

  function C () {
    this.constructor = child
  }

  C.prototype = parent.prototype
  child.prototype = new C()
  child.__super__ = parent.prototype
  return child
}
