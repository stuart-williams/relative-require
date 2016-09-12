'use babel'

import Q from 'q'
import fs from 'fs'
import { uniq } from 'ramda'
import { camelCase, kebabCase, snakeCase } from 'lodash'

const isDirectory = (path) => fs.lstatSync(path).isDirectory()
const caseify = (m) => uniq([ m, camelCase(m), kebabCase(m), snakeCase(m) ])
const readFile = (path) => Q.nfcall(fs.readFile, path, 'utf8')

export default {
  isDirectory,
  caseify,
  readFile
}
