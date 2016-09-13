var SelectListView = require('atom-space-pen-views').SelectListView
var inherits = require('./inherits')

var FileList = function () {
  return FileList.__super__.constructor.apply(this, arguments)
}

inherits(FileList, SelectListView)

FileList.prototype.initialize = function (items) {
  FileList.__super__.initialize.apply(this, arguments)
  this.storeFocusedElement()
  this.setItems(items)
  this.panel = atom.workspace.addModalPanel({ item: this })
  this.panel.show()
  this.focusFilterEditor()
}

FileList.prototype.viewForItem = function (item) {
  return '<li><div class="file icon icon-file-text" data-name="' + item.name + '" data-path="' + item.path + '">' + item.name + '</div></li>'
}

FileList.prototype.getFilterKey = function () {
  return 'path'
}

FileList.prototype.confirmed = function (item) {
  this.trigger('confirmed', item)
  this.cancelled()
  this.restoreFocus()
}

FileList.prototype.cancelled = function () {
  this.panel.destroy()
}

module.exports = FileList
