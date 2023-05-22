// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import stream from 'node:stream'
import fixtures from '../common/fixtures'

const encoding = 'base64'

const example = fixtures.path('x.txt')
const assertStream = new stream.Writable({
  write(chunk, enc, next) {
    const expected = Buffer.from('xyz')
    assert(chunk.equals(expected))
  },
})
assertStream.setDefaultEncoding(encoding)
fs.createReadStream(example, encoding).pipe(assertStream)
