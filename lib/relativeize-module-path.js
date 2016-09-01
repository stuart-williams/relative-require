'use babel'

import { curry } from 'ramda'
import path from 'path'

export default curry((activePath, modPath) => {
  let relPath = path.relative(activePath, modPath)
  return relPath.startsWith('.') ? relPath : `./${relPath}`
})
