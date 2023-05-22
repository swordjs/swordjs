// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert'
import common from '../common'
import tmpdir from '../common/tmpdir'

const file = path.join(tmpdir.path, 'write_stream_filehandle_test.txt')
const input = 'hello world'

tmpdir.refresh()

fs.promises.open(file, 'w+').then((handle) => {
  handle.on('close', common.mustCall())
  const stream = fs.createWriteStream(null, { fd: handle })

  stream.end(input)
  stream.on('close', common.mustCall(() => {
    const output = fs.readFileSync(file, 'utf-8')
    assert.strictEqual(output, input)
  }))
}).then(common.mustCall())
