// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// This tests that the lower bits of mode > 0o777 still works in fs.mkdir().

import assert from 'node:assert'
import path from 'node:path'
import fs from 'node:fs'
import common from '../common'

import tmpdir from '../common/tmpdir'

// mode is unsupported in wasi now
if (common.isWindows)
  common.skip('mode is not supported in mkdir on Windows')

const mode = 0o644
const maskToIgnore = 0o10000
tmpdir.refresh()

function test(mode, asString) {
  const suffix = asString ? 'str' : 'num'
  const input = asString
    ? (mode | maskToIgnore).toString(8)
    : (mode | maskToIgnore)

  {
    const dir = path.join(tmpdir.path, `mkdirSync-${suffix}`)
    fs.mkdirSync(dir, input)
    assert.strictEqual(fs.statSync(dir).mode & 0o777, mode)
  }

  {
    const dir = path.join(tmpdir.path, `mkdir-${suffix}`)
    fs.mkdir(dir, input, common.mustSucceed(() => {
      assert.strictEqual(fs.statSync(dir).mode & 0o777, mode)
    }))
  }
}

test(mode, true)
test(mode, false)
