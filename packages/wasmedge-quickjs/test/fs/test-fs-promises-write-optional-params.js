// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// This test ensures that filehandle.write accepts "named parameters" object
// and doesn't interpret objects as strings

import assert from 'node:assert'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import common from '../common'
import tmpdir from '../common/tmpdir'

tmpdir.refresh()

const dest = path.resolve(tmpdir.path, 'tmp.txt')
const buffer = Buffer.from('zyx')

async function testInvalid(dest, expectedCode, ...params) {
  if (params.length >= 2)
    params[1] = common.mustNotMutateObjectDeep(params[1])

  let fh
  try {
    fh = await fsPromises.open(dest, 'w+')
    await assert.rejects(
      fh.write(...params),
      { code: expectedCode })
  }
  finally {
    await fh?.close()
  }
}

async function testValid(dest, buffer, options) {
  const length = options?.length
  const offset = options?.offset
  let fh
  try {
    fh = await fsPromises.open(dest, 'w+')
    const writeResult = await fh.write(buffer, options)
    writeResult.buffer = new Uint8Array(writeResult.buffer)
    const writeBufCopy = Uint8Array.prototype.slice.call(writeResult.buffer)

    const readResult = await fh.read(buffer, options)
    readResult.buffer = new Uint8Array(readResult.buffer)
    const readBufCopy = Uint8Array.prototype.slice.call(readResult.buffer)

    assert.ok(writeResult.bytesWritten >= readResult.bytesRead)
    if (length !== undefined && length !== null)
      assert.strictEqual(writeResult.bytesWritten, length)

    if (offset === undefined || offset === 0)
      assert.deepStrictEqual(writeBufCopy, readBufCopy)

    assert.deepStrictEqual(writeResult.buffer, readResult.buffer)
  }
  finally {
    await fh?.close()
  }
}

(async () => {
  // Test if first argument is not wrongly interpreted as ArrayBufferView|string
  for (const badBuffer of [
    undefined, null, true, 42, 42n, Symbol('42'), NaN, [], () => {},
    common.mustNotCall(),
    common.mustNotMutateObjectDeep({}),
    Promise.resolve(new Uint8Array(1)),
    {},
    { buffer: 'amNotParam' },
    { string: 'amNotParam' },
    { buffer: new Uint8Array(1).buffer },
    new Date(),
    new String('notPrimitive'),
    { toString() { return 'amObject' } },
    { [Symbol.toPrimitive]: hint => 'amObject' },
  ])
    await testInvalid(dest, 'ERR_INVALID_ARG_TYPE', common.mustNotMutateObjectDeep(badBuffer), {})

  // First argument (buffer or string) is mandatory
  await testInvalid(dest, 'ERR_INVALID_ARG_TYPE')

  // Various invalid options
  await testInvalid(dest, 'ERR_OUT_OF_RANGE', buffer, { length: 5 })
  await testInvalid(dest, 'ERR_OUT_OF_RANGE', buffer, { offset: 5 })
  await testInvalid(dest, 'ERR_OUT_OF_RANGE', buffer, { length: 1, offset: 3 })
  await testInvalid(dest, 'ERR_OUT_OF_RANGE', buffer, { length: -1 })
  await testInvalid(dest, 'ERR_OUT_OF_RANGE', buffer, { offset: -1 })
  await testInvalid(dest, 'ERR_INVALID_ARG_TYPE', buffer, { offset: false })
  await testInvalid(dest, 'ERR_INVALID_ARG_TYPE', buffer, { offset: true })

  // Test compatibility with filehandle.read counterpart
  for (const options of [
    undefined,
    null,
    {},
    { length: 1 },
    { position: 5 },
    { length: 1, position: 5 },
    { length: 1, position: -1, offset: 2 },
    { length: null },
    { position: null },
    { offset: 1 },
  ])
    await testValid(dest, buffer, common.mustNotMutateObjectDeep(options))
})().then(common.mustCall())
