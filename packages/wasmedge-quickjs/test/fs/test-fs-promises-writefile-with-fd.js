// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// This test makes sure that `writeFile()` always writes from the current
// position of the file, instead of truncating the file.

import assert from 'node:assert'
import path from 'node:path'
import { readFileSync } from 'node:fs'
import { open } from 'node:fs/promises'
import common from '../common'

import tmpdir from '../common/tmpdir'

tmpdir.refresh()

const fn = path.join(tmpdir.path, 'test.txt')

async function writeFileTest() {
  const handle = await open(fn, 'w')

  /* Write only five bytes, so that the position moves to five. */
  const buf = Buffer.from('Hello')
  const { bytesWritten } = await handle.write(buf, 0, 5, null)
  assert.strictEqual(bytesWritten, 5)

  /* Write some more with writeFile(). */
  await handle.writeFile('World')

  /* New content should be written at position five, instead of zero. */
  assert.strictEqual(readFileSync(fn).toString(), 'HelloWorld')

  await handle.close()
}

writeFileTest()
  .then(common.mustCall()).catch(err => print(err, err.stack))
