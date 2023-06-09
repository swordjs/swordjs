// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// Test that mkdir with recursive option returns appropriate error
// when executed on folder it does not have permission to access.
// Ref: https://github.com/nodejs/node/issues/31481

import process from 'node:process'

import assert from 'node:assert'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import tmpdir from '../common/tmpdir'
import common from '../common'

if (!common.isWindows && process.getuid() === 0)
  common.skip('as this test should not be run as `root`')

if (common.isIBMi)
  common.skip('IBMi has a different access permission mechanism')
tmpdir.refresh()

let n = 0

function makeDirectoryReadOnly(dir) {
  let accessErrorCode = 'EACCES'
  if (common.isWindows) {
    accessErrorCode = 'EPERM'
    execSync(`icacls ${dir} /deny "everyone:(OI)(CI)(DE,DC,AD,WD)"`)
  }
  else {
    fs.chmodSync(dir, '444')
  }
  return accessErrorCode
}

function makeDirectoryWritable(dir) {
  if (common.isWindows)
    execSync(`icacls ${dir} /remove:d "everyone"`)
}

// Synchronous API should return an EACCESS error with path populated.
{
  const dir = path.join(tmpdir.path, `mkdirp_${n++}`)
  fs.mkdirSync(dir)
  const codeExpected = makeDirectoryReadOnly(dir)
  let err = null
  try {
    fs.mkdirSync(path.join(dir, '/foo'), { recursive: true })
  }
  catch (_err) {
    err = _err
  }
  makeDirectoryWritable(dir)
  assert(err)
  assert.strictEqual(err.code, codeExpected)
  assert(err.path)
}

// Asynchronous API should return an EACCESS error with path populated.
{
  const dir = path.join(tmpdir.path, `mkdirp_${n++}`)
  fs.mkdirSync(dir)
  const codeExpected = makeDirectoryReadOnly(dir)
  fs.mkdir(path.join(dir, '/bar'), { recursive: true }, (err) => {
    makeDirectoryWritable(dir)
    assert(err)
    assert.strictEqual(err.code, codeExpected)
    assert(err.path)
  })
}
