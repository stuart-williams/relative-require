'use babel'

import Q from 'q'
import fs from 'fs'
import path from 'path'
import { keys } from 'lodash'

const readFile = (filePath) => Q.nfcall(fs.readFile, filePath, 'utf-8')

export default (projectPath) =>
  readFile(path.join(projectPath, 'package.json'))
    .then(JSON.parse)
    .then((data) => keys(data.dependencies))
