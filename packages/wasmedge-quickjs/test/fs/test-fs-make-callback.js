// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'

import { sep } from 'node:path'

import tmpdir from '../common/tmpdir'

const callbackThrowValues = [null, true, false, 0, 1, 'foo', /foo/, [], {}]
tmpdir.refresh()

function testMakeCallback(cb) {
  return function () {
    // fs.mkdtemp() calls makeCallback() on its third argument
    fs.mkdtemp(`${tmpdir.path}${sep}`, {}, cb)
  }
}

function invalidCallbackThrowsTests() {
  callbackThrowValues.forEach((value) => {
    assert.throws(testMakeCallback(value), {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    })
  })
}

invalidCallbackThrowsTests()
