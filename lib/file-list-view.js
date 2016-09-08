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

  getFilterKey () {
    return 'path'
  }

  confirmed (item) {
    this.trigger('confirmed', item)
    this.cancelled()
  }

  cancelled () {
    this.panel.destroy()
  }
}

export default FileList
