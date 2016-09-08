'use babel'

import { SelectListView } from 'atom-space-pen-views'

class FileList extends SelectListView {
  constructor (items) {
    super()

    this.setItems(items)
    this.panel = atom.workspace.addModalPanel({ item: this })
    this.panel.show()
    this.focusFilterEditor()
  }

  viewForItem (item) {
    return `<li><div class="file icon icon-file-text" data-name="${item.name}" data-path="${item.path}">${item.name}</div></li>`
  }

  confirmed (item) {
    this.panel.hide()
    this.trigger('confirmed', item)
  }

  cancelled () {
    this.panel.hide()
  }
}

export default FileList
