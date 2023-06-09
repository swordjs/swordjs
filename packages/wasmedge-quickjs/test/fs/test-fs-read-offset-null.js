// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// Test to assert the desired functioning of fs.read
// when {offset:null} is passed as options parameter

import assert from 'node:assert'
import fs from 'node:fs'
import common from '../common'
import fixtures from '../common/fixtures'

const fsPromises = fs.promises
const filepath = fixtures.path('x.txt')

const buf = Buffer.alloc(1)
// Reading only one character, hence buffer of one byte is enough.

// Tests are done by making sure the first letter in buffer is
// same as first letter in file.
// 120 is the ascii code of letter x.

// Tests for callback API.
fs.open(filepath, 'r', common.mustSucceed((fd) => {
  fs.read(fd, { offset: null, buffer: buf },
    common.mustSucceed((bytesRead, buffer) => {
      assert.strictEqual(buffer[0], 120)
      fs.close(fd, common.mustSucceed(() => { }))
    }))
}))

fs.open(filepath, 'r', common.mustSucceed((fd) => {
  fs.read(fd, buf, { offset: null },
    common.mustSucceed((bytesRead, buffer) => {
      assert.strictEqual(buffer[0], 120)
      fs.close(fd, common.mustSucceed(() => { }))
    }))
}))

let filehandle = null;
(async () => {
  // Tests for promises api
  await (async () => {
    filehandle = await fsPromises.open(filepath, 'r')
    const readObject = await filehandle.read(buf, { offset: null })
    assert.strictEqual(readObject.buffer[0], 120)
  })()
    .finally(() => filehandle?.close())
    .then(common.mustCall())

  // Undocumented: omitted position works the same as position === null
  await (async () => {
    filehandle = await fsPromises.open(filepath, 'r')
    const readObject = await filehandle.read(buf, null, buf.length)
    assert.strictEqual(readObject.buffer[0], 120)
  })()
    .finally(() => filehandle?.close())
    .then(common.mustCall())

  await (async () => {
    filehandle = await fsPromises.open(filepath, 'r')
    const readObject = await filehandle.read(buf, null, buf.length, 0)
    assert.strictEqual(readObject.buffer[0], 120)
  })()
    .finally(() => filehandle?.close())
    .then(common.mustCall())
})()
