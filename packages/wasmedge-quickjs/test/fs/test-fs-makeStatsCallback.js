// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import common from '../common'

const callbackThrowValues = [null, true, false, 0, 1, 'foo', /foo/, [], {}]

const __filename = args[0]

function testMakeStatsCallback(cb) {
  return function () {
    // fs.stat() calls makeStatsCallback() on its second argument
    fs.stat(__filename, cb)
  }
}

// Verify the case where a callback function is provided
testMakeStatsCallback(common.mustCall())()

function invalidCallbackThrowsTests() {
  callbackThrowValues.forEach((value) => {
    assert.throws(testMakeStatsCallback(value), {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    })
  })
}

invalidCallbackThrowsTests()
