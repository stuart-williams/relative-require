'use babel'

import R from 'ramda'

export default (projectPath, activePath) => (modPath) => {
  let path = modPath.replace(activePath, '')
  if (path.length < modPath.length) {
    return `.${path}`
  }

  let getRel = R.compose(
    R.join(''),
    R.map(R.always('../')),
    R.reject(R.isEmpty),
    R.split('/'),
    R.replace(projectPath, '')
  )

  return `${getRel(activePath)}${R.replace(`${projectPath}/`, '', modPath)}`
}
