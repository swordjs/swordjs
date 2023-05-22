// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import common from '../common'
import fixtures from '../common/fixtures'

const string_dir = fs.realpathSync(fixtures.fixturesDir)
const buffer_dir = Buffer.from(string_dir)

const encodings = ['ascii', 'utf8', 'utf16le', 'ucs2',
  'base64', 'binary', 'hex']
const expected = {}
encodings.forEach((encoding) => {
  expected[encoding] = buffer_dir.toString(encoding)
})

// test sync version
let encoding
for (encoding in expected) {
  const expected_value = expected[encoding]
  let result

  result = fs.realpathSync(string_dir, { encoding })
  assert.strictEqual(result, expected_value)

  result = fs.realpathSync(string_dir, encoding)
  assert.strictEqual(result, expected_value)

  result = fs.realpathSync(buffer_dir, { encoding })
  assert.strictEqual(result, expected_value)

  result = fs.realpathSync(buffer_dir, encoding)
  assert.strictEqual(result, expected_value)
}

let buffer_result
buffer_result = fs.realpathSync(string_dir, { encoding: 'buffer' })
assert.deepStrictEqual(buffer_result, buffer_dir)

buffer_result = fs.realpathSync(string_dir, 'buffer')
assert.deepStrictEqual(buffer_result, buffer_dir)

buffer_result = fs.realpathSync(buffer_dir, { encoding: 'buffer' })
assert.deepStrictEqual(buffer_result, buffer_dir)

buffer_result = fs.realpathSync(buffer_dir, 'buffer')
assert.deepStrictEqual(buffer_result, buffer_dir)

// test async version
for (encoding in expected) {
  const expected_value = expected[encoding]

  fs.realpath(
    string_dir,
    { encoding },
    common.mustSucceed((res) => {
      assert.strictEqual(res, expected_value)
    }),
  )
  fs.realpath(string_dir, encoding, common.mustSucceed((res) => {
    assert.strictEqual(res, expected_value)
  }))
  fs.realpath(
    buffer_dir,
    { encoding },
    common.mustSucceed((res) => {
      assert.strictEqual(res, expected_value)
    }),
  )
  fs.realpath(buffer_dir, encoding, common.mustSucceed((res) => {
    assert.strictEqual(res, expected_value)
  }))
}

fs.realpath(string_dir, { encoding: 'buffer' }, common.mustSucceed((res) => {
  assert.deepStrictEqual(res, buffer_dir)
}))

fs.realpath(string_dir, 'buffer', common.mustSucceed((res) => {
  assert.deepStrictEqual(res, buffer_dir)
}))

fs.realpath(buffer_dir, { encoding: 'buffer' }, common.mustSucceed((res) => {
  assert.deepStrictEqual(res, buffer_dir)
}))

fs.realpath(buffer_dir, 'buffer', common.mustSucceed((res) => {
  assert.deepStrictEqual(res, buffer_dir)
}))
