// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// This test ensures that fs.existsSync doesn't incorrectly return false.
// (especially on Windows)
// https://github.com/nodejs/node-v0.x-archive/issues/3739

import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import tmpdir from '../common/tmpdir'
import common from '../common'

let dir = path.resolve(tmpdir.path)

// Make sure that the tmp directory is clean
tmpdir.refresh()

// wasmedge no support so long path
// Make a long path.
for (let i = 0; i < 50; i++) {
  dir = `${dir}/1234567890`
  try {
    fs.mkdirSync(dir, '0777')
  }
  catch (e) {
    if (e.code !== 'EEXIST')
      throw e
  }
}

// Test if file exists synchronously
assert(fs.existsSync(dir), 'Directory is not accessible')

// Test if file exists asynchronously
fs.access(dir, common.mustSucceed())
