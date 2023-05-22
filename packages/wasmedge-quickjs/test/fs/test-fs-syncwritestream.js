// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import { spawn } from 'node:child_process'
import stream from 'node:stream'
import fs from 'node:fs'
import path from 'node:path'
import common from '../common'

import tmpdir from '../common/tmpdir'

// require('internal/fs/utils').SyncWriteStream is used as a stdio
// implementation when stdout/stderr point to files.

if (process.argv[2] === 'child') {
  // Note: Calling console.log() is part of this test as it exercises the
  // SyncWriteStream#_write() code path.
  console.log(JSON.stringify([process.stdout, process.stderr].map(stdio => ({
    instance: stdio instanceof stream.Writable,
    readable: stdio.readable,
    writable: stdio.writable,
  }))))

  return
}
tmpdir.refresh()

const filename = path.join(tmpdir.path, 'stdout')
const stdoutFd = fs.openSync(filename, 'w')

const proc = spawn(process.execPath, [__filename, 'child'], {
  stdio: ['inherit', stdoutFd, stdoutFd],
})

proc.on('close', common.mustCall(() => {
  fs.closeSync(stdoutFd)

  assert.deepStrictEqual(JSON.parse(fs.readFileSync(filename, 'utf8')), [
    { instance: true, readable: false, writable: true },
    { instance: true, readable: false, writable: true },
  ])
}))
