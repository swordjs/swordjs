// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import path from 'node:path'
import fs from 'node:fs'
import assert from 'node:assert'
import common from '../common'

import tmpdir from '../common/tmpdir'

if (!common.isLinux)
  common.skip('Test is linux specific.')
tmpdir.refresh()
const filename = '\uD83D\uDC04'
const root = Buffer.from(`${tmpdir.path}${path.sep}`)
const filebuff = Buffer.from(filename, 'ucs2')
const fullpath = Buffer.concat([root, filebuff])

try {
  fs.closeSync(fs.openSync(fullpath, 'w+'))
}
catch (e) {
  if (e.code === 'EINVAL')
    common.skip('test requires filesystem that supports UCS2')
  throw e
}

fs.readdir(tmpdir.path, 'ucs2', common.mustSucceed((list) => {
  assert.strictEqual(list.length, 1)
  const fn = list[0]
  assert.deepStrictEqual(Buffer.from(fn, 'ucs2'), filebuff)
  assert.strictEqual(fn, filename)
}))
