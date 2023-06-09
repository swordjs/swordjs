// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import path from 'node:path'
import fs from 'node:fs'
import common from '../common'

import tmpdir from '../common/tmpdir'

tmpdir.refresh()
const tmpDir = tmpdir.path
const longPath = path.join(...[tmpDir].concat(Array(30).fill('1234567890')))
fs.mkdirSync(longPath, { recursive: true })

// Test if we can have symlinks to files and folders with long filenames
const targetDirectory = path.join(longPath, 'target-directory')
fs.mkdirSync(targetDirectory)
const pathDirectory = path.join(tmpDir, 'new-directory')
fs.symlink(targetDirectory, pathDirectory, 'dir', common.mustSucceed(() => {
  assert(fs.existsSync(pathDirectory))
}))

const targetFile = path.join(longPath, 'target-file')
fs.writeFileSync(targetFile, 'data')
const pathFile = path.join(tmpDir, 'new-file')
fs.symlink(targetFile, pathFile, common.mustSucceed(() => {
  assert(fs.existsSync(pathFile))
}))
