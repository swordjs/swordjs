// Copyright Joyent and Node contributors. All rights reserved. MIT license.

'use strict'

import assert from 'node:assert'
import path from 'node:path'
import fs from 'node:fs'
import common from '../common'
import tmpdir from '../common/tmpdir'

tmpdir.refresh()

const expected = 'ümlaut. Лорем 運務ホソモ指及 आपको करने विकास 紙読決多密所 أضف'

let cnt = 0
function getFileName() {
  return path.join(tmpdir.path, `readv_${++cnt}.txt`)
}
const exptectedBuff = Buffer.from(expected)

function allocateEmptyBuffers(combinedLength) {
  const bufferArr = []
  // Allocate two buffers, each half the size of exptectedBuff
  bufferArr[0] = Buffer.alloc(Math.floor(combinedLength / 2))
  bufferArr[1] = Buffer.alloc(combinedLength - bufferArr[0].length)

  return bufferArr
}

function getCallback(fd, bufferArr) {
  return common.mustSucceed((bytesRead, buffers) => {
    assert.deepStrictEqual(bufferArr, buffers)
    const expectedLength = exptectedBuff.length
    assert.deepStrictEqual(bytesRead, expectedLength)
    fs.closeSync(fd)

    assert(Buffer.concat(bufferArr).equals(exptectedBuff))
  })
}

// fs.readv with array of buffers with all parameters
{
  const filename = getFileName()
  const fd = fs.openSync(filename, 'w+')
  fs.writeSync(fd, exptectedBuff)

  const bufferArr = allocateEmptyBuffers(exptectedBuff.length)
  const callback = getCallback(fd, bufferArr)

  fs.readv(fd, bufferArr, 0, callback)
}

// fs.readv with array of buffers without position
{
  const filename = getFileName()
  fs.writeFileSync(filename, exptectedBuff)
  const fd = fs.openSync(filename, 'r')

  const bufferArr = allocateEmptyBuffers(exptectedBuff.length)
  const callback = getCallback(fd, bufferArr)

  fs.readv(fd, bufferArr, callback)
}

/**
 * Testing with incorrect arguments
 */
const wrongInputs = [false, 'test', {}, [{}], ['sdf'], null, undefined]

{
  const filename = getFileName(2)
  fs.writeFileSync(filename, exptectedBuff)
  const fd = fs.openSync(filename, 'r')

  wrongInputs.forEach((wrongInput) => {
    assert.throws(
      () => fs.readv(fd, wrongInput, null, common.mustNotCall()), {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError',
      },
    )
  })

  fs.closeSync(fd)
}

{
  // fs.readv with wrong fd argument
  wrongInputs.forEach((wrongInput) => {
    assert.throws(
      () => fs.readv(wrongInput, common.mustNotCall()),
      {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError',
      },
    )
  })
}
