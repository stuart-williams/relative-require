'use babel'

import path from 'path'

export default (activePath) => (modPath) => {
  let relPath = path.relative(activePath, modPath)
  return relPath.startsWith('.') ? relPath : `./${relPath}`
}
