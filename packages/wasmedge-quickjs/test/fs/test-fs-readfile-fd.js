// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// Test fs.readFile using a file descriptor.

import assert from 'node:assert'
import fs from 'node:fs'
import { join } from 'node:path'
import fixtures from '../common/fixtures'
import common from '../common'
import tmpdir from '../common/tmpdir'

const fn = fixtures.path('empty.txt')
tmpdir.refresh()

tempFd((fd, close) => {
  fs.readFile(fd, (err, data) => {
    assert.ok(data)
    close()
  })
})

tempFd((fd, close) => {
  fs.readFile(fd, 'utf8', (err, data) => {
    assert.strictEqual(data, '')
    close()
  })
})

tempFdSync((fd) => {
  assert.ok(fs.readFileSync(fd))
})

tempFdSync((fd) => {
  assert.strictEqual(fs.readFileSync(fd, 'utf8'), '')
})

function tempFd(callback) {
  fs.open(fn, 'r', (err, fd) => {
    assert.ifError(err)
    callback(fd, () => {
      fs.close(fd, (err) => {
        assert.ifError(err)
      })
    })
  })
}

function tempFdSync(callback) {
  const fd = fs.openSync(fn, 'r')
  callback(fd)
  fs.closeSync(fd)
}

{
  // This test makes sure that `readFile()` always reads from the current
  // position of the file, instead of reading from the beginning of the file,
  // when used with file descriptors.

  const filename = join(tmpdir.path, 'test.txt')
  fs.writeFileSync(filename, 'Hello World')

  {
    // Tests the fs.readFileSync().
    const fd = fs.openSync(filename, 'r')

    // Read only five bytes, so that the position moves to five.
    const buf = Buffer.alloc(5)
    assert.strictEqual(fs.readSync(fd, buf, 0, 5), 5)
    assert.strictEqual(buf.toString(), 'Hello')

    // readFileSync() should read from position five, instead of zero.
    assert.strictEqual(fs.readFileSync(fd).toString(), ' World')

    fs.closeSync(fd)
  }

  {
    // Tests the fs.readFile().
    fs.open(filename, 'r', common.mustSucceed((fd) => {
      const buf = Buffer.alloc(5)

      // Read only five bytes, so that the position moves to five.
      fs.read(fd, buf, 0, 5, null, common.mustSucceed((bytes) => {
        assert.strictEqual(bytes, 5)
        assert.strictEqual(buf.toString(), 'Hello')

        fs.readFile(fd, common.mustSucceed((data) => {
          // readFile() should read from position five, instead of zero.
          assert.strictEqual(data.toString(), ' World')

          fs.closeSync(fd)
        }))
      }))
    }))
  }
}
