// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
// Flags: --expose-internals

// The following tests validate aggregate errors are thrown correctly
// when both an operation and close throw.

import path from 'node:path'
import {
  lchmod,
  readFile,
  truncate,
  writeFile,
} from 'node:fs/promises'
import {
  FileHandle,
} from 'node:fs'

import assert from 'node:assert'
import tmpdir from '../common/tmpdir'
import common from '../common'

const originalFd = Object.getOwnPropertyDescriptor(FileHandle.prototype, 'fd')

let count = 0
async function createFile() {
  const filePath = path.join(tmpdir.path, `op_errors_${++count}.txt`)
  await writeFile(filePath, 'content')
  return filePath
}

async function checkOperationError(op) {
  try {
    const filePath = await createFile()
    Object.defineProperty(FileHandle.prototype, 'fd', {
      get() {
        // Verify that close is called when an error is thrown
        this.close = common.mustCall(this.close)
        const opError = new Error('INTERNAL_ERROR')
        opError.code = 123
        throw opError
      },
    })

    await assert.rejects(op(filePath), {
      name: 'Error',
      message: 'INTERNAL_ERROR',
      code: 123,
    })
  }
  finally {
    Object.defineProperty(FileHandle.prototype, 'fd', originalFd)
  }
}
(async function () {
  tmpdir.refresh()
  await checkOperationError(filePath => truncate(filePath))
  await checkOperationError(filePath => readFile(filePath))
  await checkOperationError(filePath => writeFile(filePath, '123'))
  if (common.isOSX)
    await checkOperationError(filePath => lchmod(filePath, 0o777))
})().then(common.mustCall())
