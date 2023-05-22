// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// This test ensures fs.realpathSync works on properly on Windows without
// throwing ENOENT when the path involves a fileserver.
// https://github.com/nodejs/node-v0.x-archive/issues/3542

import assert from 'node:assert'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import common from '../common'

// This test is only relevant on Windows.
if (!common.isWindows)
  common.skip('Windows specific test.')

function test(p) {
  const result = fs.realpathSync(p)
  assert.strictEqual(result.toLowerCase(), path.resolve(p).toLowerCase())

  fs.realpath(p, common.mustSucceed((result) => {
    assert.strictEqual(result.toLowerCase(), path.resolve(p).toLowerCase())
  }))
}

test(`//${os.hostname()}/c$/Windows/System32`)
test(`//${os.hostname()}/c$/Windows`)
test(`//${os.hostname()}/c$/`)
test(`\\\\${os.hostname()}\\c$\\`)
test('C:\\')
test('C:')
test(process.env.windir)
