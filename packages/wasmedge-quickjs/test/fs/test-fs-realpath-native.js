// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import common from '../common'

const filename = __filename.toLowerCase()

assert.strictEqual(
  fs.realpathSync.native('./test/parallel/test-fs-realpath-native.js')
    .toLowerCase(),
  filename)

fs.realpath.native(
  './test/parallel/test-fs-realpath-native.js',
  common.mustSucceed(function (res) {
    assert.strictEqual(res.toLowerCase(), filename)
    assert.strictEqual(this, undefined)
  }))
