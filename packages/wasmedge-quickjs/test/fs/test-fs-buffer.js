// Copyright Joyent and Node contributors. All rights reserved. MIT license.

'use strict'

import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import fixtures from '../common/fixtures'
import common from '../common'

import tmpdir from '../common/tmpdir'

tmpdir.refresh()

fs.access(Buffer.from(tmpdir.path), common.mustSucceed())

const buf = Buffer.from(path.join(tmpdir.path, 'a.txt'))
fs.open(buf, 'w+', common.mustSucceed((fd) => {
  assert(fd)
  fs.close(fd, common.mustSucceed())
}))

assert.throws(
  () => {
    fs.accessSync(true)
  },
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "path" argument must be of type string or an instance of '
             + 'Buffer or URL. Received type boolean (true)',
  },
)

const dir = Buffer.from(fixtures.fixturesDir)
fs.readdir(dir, 'hex', common.mustSucceed((hexList) => {
  fs.readdir(dir, common.mustSucceed((stringList) => {
    stringList.forEach((val, idx) => {
      const fromHexList = Buffer.from(hexList[idx], 'hex').toString()
      assert.strictEqual(
        fromHexList,
        val,
        `expected ${val}, got ${fromHexList} by hex decoding ${hexList[idx]}`,
      )
    })
  }))
}))
