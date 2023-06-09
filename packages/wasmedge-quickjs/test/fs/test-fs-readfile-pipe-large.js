// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import path from 'node:path'
import fs from 'node:fs'

import { exec } from 'node:child_process'
import tmpdir from '../common/tmpdir'

import common from '../common'

// Simulate `cat readfile.js | node readfile.js`

if (common.isWindows || common.isAIX)
  common.skip(`No /dev/stdin on ${process.platform}.`)

if (process.argv[2] === 'child') {
  fs.readFile('/dev/stdin', (er, data) => {
    assert.ifError(er)
    process.stdout.write(data)
  })
  return
}

const filename = path.join(tmpdir.path, '/readfile_pipe_large_test.txt')
const dataExpected = 'a'.repeat(999999)
tmpdir.refresh()
fs.writeFileSync(filename, dataExpected)
const f = JSON.stringify(__filename)
const node = JSON.stringify(process.execPath)
const cmd = `cat ${filename} | ${node} ${f} child`
exec(cmd, { maxBuffer: 1000000 }, common.mustSucceed((stdout, stderr) => {
  assert.strictEqual(
    stdout,
    dataExpected,
    `expect it reads the file and outputs 999999 'a' but got : ${stdout}`,
  )
  assert.strictEqual(
    stderr,
    '',
    `expect that it does not write to stderr, but got : ${stderr}`,
  )
  console.log('ok')
}))
