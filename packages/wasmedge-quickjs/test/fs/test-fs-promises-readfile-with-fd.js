// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// This test makes sure that `readFile()` always reads from the current
// position of the file, instead of reading from the beginning of the file.

import assert from 'node:assert'
import path from 'node:path'
import { writeFileSync } from 'node:fs'
import { open } from 'node:fs/promises'
import common from '../common'

import tmpdir from '../common/tmpdir'

tmpdir.refresh()

const fn = path.join(tmpdir.path, 'test.txt')
writeFileSync(fn, 'Hello World')

async function readFileTest() {
  const handle = await open(fn, 'r')

  /* Read only five bytes, so that the position moves to five. */
  const buf = Buffer.alloc(5)
  const { bytesRead } = await handle.read(buf, 0, 5, null)
  assert.strictEqual(bytesRead, 5)
  assert.strictEqual(buf.toString(), 'Hello')

  /* readFile() should read from position five, instead of zero. */
  assert.strictEqual((await handle.readFile()).toString(), ' World')

  await handle.close()
}

readFileTest()
  .then(common.mustCall())
