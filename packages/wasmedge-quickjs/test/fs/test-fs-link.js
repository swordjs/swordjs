// Copyright Joyent and Node contributors. All rights reserved. MIT license.

'use strict'
import assert from 'node:assert'
import path from 'node:path'
import fs from 'node:fs'
import common from '../common'

import tmpdir from '../common/tmpdir'

tmpdir.refresh()

// Test creating and reading hard link
const srcPath = path.join(tmpdir.path, 'hardlink-target.txt')
const dstPath = path.join(tmpdir.path, 'link1.js')
fs.writeFileSync(srcPath, 'hello world')

function callback(err) {
  assert.ifError(err)
  const dstContent = fs.readFileSync(dstPath, 'utf8')
  assert.strictEqual(dstContent, 'hello world')
}

fs.link(srcPath, dstPath, common.mustCall(callback));

// test error outputs

[false, 1, [], {}, null, undefined].forEach((i) => {
  assert.throws(
    () => fs.link(i, '', common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    },
  )
  assert.throws(
    () => fs.link('', i, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    },
  )
  assert.throws(
    () => fs.linkSync(i, ''),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    },
  )
  assert.throws(
    () => fs.linkSync('', i),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    },
  )
})
