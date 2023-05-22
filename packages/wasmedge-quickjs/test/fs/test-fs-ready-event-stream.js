// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import common from '../common'
import tmpdir from '../common/tmpdir'

const __filename = args[0]

const readStream = fs.createReadStream(__filename)
assert.strictEqual(readStream.pending, true)
readStream.on('ready', common.mustCall(() => {
  assert.strictEqual(readStream.pending, false)
}))

const writeFile = path.join(tmpdir.path, 'write-fsreadyevent.txt')
tmpdir.refresh()
const writeStream = fs.createWriteStream(writeFile, { autoClose: true })
assert.strictEqual(writeStream.pending, true)
writeStream.on('ready', common.mustCall(() => {
  assert.strictEqual(writeStream.pending, false)
  writeStream.end()
}))
