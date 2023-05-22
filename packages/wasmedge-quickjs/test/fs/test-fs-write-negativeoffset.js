// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// Tests that passing a negative offset does not crash the process

import {
  join,
} from 'node:path'

import {
  closeSync,
  open,
  write,
  writeSync,
} from 'node:fs'

import assert from 'node:assert'
import common from '../common'

import tmpdir from '../common/tmpdir'

tmpdir.refresh()

const filename = join(tmpdir.path, 'test.txt')

open(filename, 'w+', common.mustSucceed((fd) => {
  assert.throws(() => {
    write(fd, Buffer.alloc(0), -1, common.mustNotCall())
  }, {
    code: 'ERR_OUT_OF_RANGE',
  })
  assert.throws(() => {
    writeSync(fd, Buffer.alloc(0), -1)
  }, {
    code: 'ERR_OUT_OF_RANGE',
  })
  closeSync(fd)
}))

const filename2 = join(tmpdir.path, 'test2.txt')

// Make sure negative length's don't cause aborts either

open(filename2, 'w+', common.mustSucceed((fd) => {
  assert.throws(() => {
    write(fd, Buffer.alloc(0), 0, -1, common.mustNotCall())
  }, {
    code: 'ERR_OUT_OF_RANGE',
  })
  assert.throws(() => {
    writeSync(fd, Buffer.alloc(0), 0, -1)
  }, {
    code: 'ERR_OUT_OF_RANGE',
  })
  closeSync(fd)
}))
