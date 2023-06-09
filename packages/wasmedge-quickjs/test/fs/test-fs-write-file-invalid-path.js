// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import common from '../common'

import tmpdir from '../common/tmpdir'

if (!common.isWindows)
  common.skip('This test is for Windows only.')
tmpdir.refresh()

const DATA_VALUE = 'hello'

// Refs: https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx
// Ignore '/', '\\' and ':'
const RESERVED_CHARACTERS = '<>"|?*';

[...RESERVED_CHARACTERS].forEach((ch) => {
  const pathname = path.join(tmpdir.path, `somefile_${ch}`)
  assert.throws(
    () => {
      fs.writeFileSync(pathname, DATA_VALUE)
    },
    /^Error: ENOENT: no such file or directory, open '.*'$/,
    `failed with '${ch}'`)
})

// Test for ':' (NTFS data streams).
// Refs: https://msdn.microsoft.com/en-us/library/windows/desktop/bb540537.aspx
const pathname = path.join(tmpdir.path, 'foo:bar')
fs.writeFileSync(pathname, DATA_VALUE)

let content = ''
const fileDataStream = fs.createReadStream(pathname, {
  encoding: 'utf8',
})

fileDataStream.on('data', (data) => {
  content += data
})

fileDataStream.on('end', common.mustCall(() => {
  assert.strictEqual(content, DATA_VALUE)
}))
