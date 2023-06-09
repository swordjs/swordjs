// Copyright Joyent and Node contributors. All rights reserved. MIT license.

'use strict'
import assert from 'node:assert'
import path from 'node:path'
import fs from 'node:fs/promises'
import common from '../common'
import tmpdir from '../common/tmpdir'

tmpdir.refresh()

const expected = 'ümlaut. Лорем 運務ホソモ指及 आपको करने विकास 紙読決多密所 أضف'
const exptectedBuff = Buffer.from(expected)

let cnt = 0
function getFileName() {
  return path.join(tmpdir.path, `readv_promises_${++cnt}.txt`)
}

function allocateEmptyBuffers(combinedLength) {
  const bufferArr = []
  // Allocate two buffers, each half the size of exptectedBuff
  bufferArr[0] = Buffer.alloc(Math.floor(combinedLength / 2))
  bufferArr[1] = Buffer.alloc(combinedLength - bufferArr[0].length)

  return bufferArr
}

(async () => {
  {
    const filename = getFileName()
    await fs.writeFile(filename, exptectedBuff)
    const handle = await fs.open(filename, 'r')
    // const buffer = Buffer.from(expected);
    const bufferArr = allocateEmptyBuffers(exptectedBuff.length)
    const expectedLength = exptectedBuff.length

    let { bytesRead, buffers } = await handle.readv([Buffer.from('')],
      null)
    assert.strictEqual(bytesRead, 0)
    assert.deepStrictEqual(buffers, [Buffer.from('')]);

    ({ bytesRead, buffers } = await handle.readv(bufferArr, null))
    assert.strictEqual(bytesRead, expectedLength)
    assert.deepStrictEqual(buffers, bufferArr)
    assert(Buffer.concat(bufferArr).equals(await fs.readFile(filename)))
    handle.close()
  }

  {
    const filename = getFileName()
    await fs.writeFile(filename, exptectedBuff)
    const handle = await fs.open(filename, 'r')
    // const buffer = Buffer.from(expected);
    const bufferArr = allocateEmptyBuffers(exptectedBuff.length)
    const expectedLength = exptectedBuff.length

    let { bytesRead, buffers } = await handle.readv([Buffer.from('')])
    assert.strictEqual(bytesRead, 0)
    assert.deepStrictEqual(buffers, [Buffer.from('')]);

    ({ bytesRead, buffers } = await handle.readv(bufferArr))
    assert.strictEqual(bytesRead, expectedLength)
    assert.deepStrictEqual(buffers, bufferArr)
    assert(Buffer.concat(bufferArr).equals(await fs.readFile(filename)))
    handle.close()
  }
})().then(common.mustCall())
