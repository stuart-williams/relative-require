'use babel'

export default (type, variable, path) => {
  switch (type) {
    case 'require':
      return `var ${variable} = require('${path}')`
    case 'import':
      return `import ${variable} from '${path}'`
  }
  return ''
}
