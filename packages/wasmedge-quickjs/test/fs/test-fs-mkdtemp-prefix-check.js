// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import common from '../common'

const prefixValues = [undefined, null, 0, true, false, 1]

function fail(value) {
  assert.throws(
    () => {
      fs.mkdtempSync(value, {})
    },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    })
}

function failAsync(value) {
  assert.throws(
    () => {
      fs.mkdtemp(value, common.mustNotCall())
    },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    })
}

prefixValues.forEach((prefixValue) => {
  fail(prefixValue)
  failAsync(prefixValue)
})
