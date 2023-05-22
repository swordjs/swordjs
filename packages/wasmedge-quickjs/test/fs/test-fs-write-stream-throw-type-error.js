// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

import tmpdir from '../common/tmpdir'

const example = path.join(tmpdir.path, 'dummy')

tmpdir.refresh()
// Should not throw.
fs.createWriteStream(example, undefined).end()
fs.createWriteStream(example, null).end()
fs.createWriteStream(example, 'utf8').end()
fs.createWriteStream(example, { encoding: 'utf8' }).end()

function createWriteStreamErr(path, opt) {
  assert.throws(
    () => {
      fs.createWriteStream(path, opt)
    },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    })
}

createWriteStreamErr(example, 123)
createWriteStreamErr(example, 0)
createWriteStreamErr(example, true)
createWriteStreamErr(example, false)
