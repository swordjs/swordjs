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
  let calls = 0
  const {
    write: originalWriteFunction,
    writev: originalWritevFunction,
  } = handle
  handle.write = function write() {
    calls++
    return Reflect.apply(originalWriteFunction, this, arguments)
  }
  handle.writev = function writev() {
    calls++
    return Reflect.apply(originalWritevFunction, this, arguments)
  }
  const stream = fs.createWriteStream(null, { fd: handle })

  stream.end(input)
  stream.on('close', common.mustCall(() => {
    assert(calls > 0, 'expected at least one call to fileHandle.write or '
    + 'fileHandle.writev, got 0')
  }))
}).then(common.mustCall())
