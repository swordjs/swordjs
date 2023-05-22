// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import common from '../common'

import tmpdir from '../common/tmpdir'

tmpdir.refresh()

{
  const stream = fs.createReadStream(__filename)
  stream.on('close', common.mustCall())
  test(stream)
}

{
  const stream = fs.createWriteStream(`${tmpdir.path}/dummy`)
  stream.on('close', common.mustCall())
  test(stream)
}

{
  const stream = fs.createReadStream(__filename, { emitClose: true })
  stream.on('close', common.mustCall())
  test(stream)
}

{
  const stream = fs.createWriteStream(`${tmpdir.path}/dummy2`,
    { emitClose: true })
  stream.on('close', common.mustCall())
  test(stream)
}

function test(stream) {
  const err = new Error('DESTROYED')
  stream.on('open', () => {
    stream.destroy(err)
  })
  stream.on('error', common.mustCall((err_) => {
    assert.strictEqual(err_, err)
  }))
}
