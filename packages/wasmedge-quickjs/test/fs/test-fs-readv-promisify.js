// Copyright Joyent and Node contributors. All rights reserved. MIT license.

'use strict'

import fs from 'node:fs'
import { promisify } from 'node:util'
import assert from 'node:assert'
import fixtures from '../common/fixtures'
import common from '../common'

const readv = promisify(fs.readv)
const filepath = fixtures.path('x.txt')
const fd = fs.openSync(filepath, 'r')

const expected = [Buffer.from('xyz\n')]

readv(fd, expected)
  .then(({ bytesRead, buffers }) => {
    assert.deepStrictEqual(bytesRead, expected[0].length)
    assert.deepStrictEqual(buffers, expected)
  })
  .then(common.mustCall())
