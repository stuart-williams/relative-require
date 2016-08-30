'use babel'

import path from 'path'

export default (activePath) => (modPath) => {
  let relPath = path.relative(activePath, modPath)
  let ext = path.parse(modPath).ext
  return (relPath.startsWith('.') ? relPath : `./${relPath}`).replace(new RegExp(`${ext}$`), '')
}
