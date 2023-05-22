// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import tmpdir from '../common/tmpdir'
import common from '../common'

tmpdir.refresh()

{
  common.expectWarning(
    'DeprecationWarning',
    'In future versions of Node.js, fs.rmdir(path, { recursive: true }) '
      + 'will be removed. Use fs.rm(path, { recursive: true }) instead',
    'DEP0147',
  )
  const filePath = path.join(tmpdir.path, 'rmdir-recursive.txt')
  fs.writeFileSync(filePath, '')
  fs.rmdir(filePath, { recursive: true }, common.mustCall((err) => {
    assert.strictEqual(err.code, common.isWindows ? 'ENOENT' : 'ENOTDIR')
  }))
}
