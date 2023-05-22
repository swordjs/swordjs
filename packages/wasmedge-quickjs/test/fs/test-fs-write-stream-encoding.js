// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import stream from 'node:stream'
import fixtures from '../common/fixtures'
import tmpdir from '../common/tmpdir'

const firstEncoding = 'base64'
const secondEncoding = 'latin1'

const examplePath = fixtures.path('x.txt')
const dummyPath = path.join(tmpdir.path, 'x.txt')

tmpdir.refresh()

const exampleReadStream = fs.createReadStream(examplePath, {
  encoding: firstEncoding,
})

const dummyWriteStream = fs.createWriteStream(dummyPath, {
  encoding: firstEncoding,
})

exampleReadStream.pipe(dummyWriteStream).on('finish', () => {
  const assertWriteStream = new stream.Writable({
    write(chunk, enc, next) {
      const expected = Buffer.from('xyz\n')
      assert(chunk.equals(expected))
    },
  })
  assertWriteStream.setDefaultEncoding(secondEncoding)
  fs.createReadStream(dummyPath, {
    encoding: secondEncoding,
  }).pipe(assertWriteStream)
})
