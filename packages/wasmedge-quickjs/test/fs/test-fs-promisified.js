// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import common from '../common'

import tmpdir from '../common/tmpdir'

const read = promisify(fs.read)
const write = promisify(fs.write)
const exists = promisify(fs.exists)

const __filename = args[0]

{
  const fd = fs.openSync(__filename, 'r')
  read(fd, Buffer.alloc(1024), 0, 1024, null).then(common.mustCall((obj) => {
    assert.strictEqual(typeof obj.bytesRead, 'number')
    assert(obj.buffer instanceof Buffer)
    fs.closeSync(fd)
  }))
}
tmpdir.refresh()
{
  const filename = path.join(tmpdir.path, 'write-promise.txt')
  const fd = fs.openSync(filename, 'w')
  write(fd, Buffer.from('foobar')).then(common.mustCall((obj) => {
    assert.strictEqual(typeof obj.bytesWritten, 'number')
    assert.strictEqual(obj.buffer.toString(), 'foobar')
    fs.closeSync(fd)
  }))
}

{
  exists(__filename).then(common.mustCall((x) => {
    assert.strictEqual(x, true)
  }))
}
