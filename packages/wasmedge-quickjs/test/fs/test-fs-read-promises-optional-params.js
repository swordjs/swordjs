// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import fs from 'node:fs'
import { promisify } from 'node:util'
import assert from 'node:assert'
import fixtures from '../common/fixtures'
import common from '../common'

const read = promisify(fs.read)
const filepath = fixtures.path('x.txt')
const fd = fs.openSync(filepath, 'r')

const expected = Buffer.from('xyz\n')
const defaultBufferAsync = Buffer.alloc(16384)
const bufferAsOption = Buffer.allocUnsafe(expected.byteLength)

read(fd, common.mustNotMutateObjectDeep({}))
  .then(({ bytesRead, buffer }) => {
    assert.strictEqual(bytesRead, expected.byteLength)
    assert.deepStrictEqual(defaultBufferAsync.byteLength, buffer.byteLength)
  })
  .then(common.mustCall())

read(fd, bufferAsOption, common.mustNotMutateObjectDeep({ position: 0 }))
  .then(({ bytesRead, buffer }) => {
    assert.strictEqual(bytesRead, expected.byteLength)
    assert.deepStrictEqual(bufferAsOption.byteLength, buffer.byteLength)
  })
  .then(common.mustCall())
