// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// The following tests validate base functionality for the fs.promises
// FileHandle.appendFile method.

import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert'
import tmpdir from '../common/tmpdir'
import common from '../common'

const { open } = fs.promises
const tmpDir = tmpdir.path

tmpdir.refresh()

async function validateAppendBuffer() {
  const filePath = path.resolve(tmpDir, 'tmp-append-file-buffer.txt')
  const fileHandle = await open(filePath, 'a')
  const buffer = Buffer.from('a&Dp'.repeat(100), 'utf8')

  await fileHandle.appendFile(buffer)
  const appendedFileData = fs.readFileSync(filePath)
  assert.deepStrictEqual(appendedFileData, buffer)

  await fileHandle.close()
}

async function validateAppendString() {
  const filePath = path.resolve(tmpDir, 'tmp-append-file-string.txt')
  const fileHandle = await open(filePath, 'a')
  const string = 'x~yz'.repeat(100)

  await fileHandle.appendFile(string)
  const stringAsBuffer = Buffer.from(string, 'utf8')
  const appendedFileData = fs.readFileSync(filePath)
  assert.deepStrictEqual(appendedFileData, stringAsBuffer)

  await fileHandle.close()
}

validateAppendBuffer()
  .then(validateAppendString)
  .then(common.mustCall())
