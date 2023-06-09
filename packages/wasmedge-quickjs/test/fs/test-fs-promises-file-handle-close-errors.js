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

import { FileHandle } from 'node:fs'

import assert from 'node:assert'
import tmpdir from '../common/tmpdir'
import common from '../common'

const originalFd = Object.getOwnPropertyDescriptor(FileHandle.prototype, 'fd')

let count = 0
async function createFile() {
  const filePath = path.join(tmpdir.path, `close_errors_${++count}.txt`)
  await writeFile(filePath, 'content')
  return filePath
}

async function checkCloseError(op) {
  try {
    const filePath = await createFile()
    Object.defineProperty(FileHandle.prototype, 'fd', {
      get() {
        // Close is set by using a setter,
        // so it needs to be set on the instance.
        const originalClose = this.close
        this.close = async () => {
          // close the file
          await originalClose.call(this)
          const closeError = new Error('CLOSE_ERROR')
          closeError.code = 456
          throw closeError
        }
        return originalFd.get.call(this)
      },
    })

    await assert.rejects(op(filePath), {
      name: 'Error',
      message: 'CLOSE_ERROR',
      code: 456,
    })
  }
  finally {
    Object.defineProperty(FileHandle.prototype, 'fd', originalFd)
  }
}
(async function () {
  tmpdir.refresh()
  await checkCloseError(filePath => truncate(filePath))
  await checkCloseError(filePath => readFile(filePath))
  await checkCloseError(filePath => writeFile(filePath, '123'))
  if (common.isOSX)
    await checkCloseError(filePath => lchmod(filePath, 0o777))
})().then(common.mustCall())
