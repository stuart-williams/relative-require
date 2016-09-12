'use babel'

import path from 'path'
import { compose, flatten, map, props, keys } from 'ramda'
import { readFile } from './helpers'

const extractDependencies = compose(flatten, map(keys), props(['dependencies', 'devDependencies']))

export default (projectPath) =>
  readFile(path.join(projectPath, 'package.json'))
    .then(JSON.parse)
    .then(extractDependencies)
