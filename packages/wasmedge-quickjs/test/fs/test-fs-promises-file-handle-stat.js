// Copyright Joyent and Node contributors. All rights reserved. MIT license.

'use strict'

// The following tests validate base functionality for the fs.promises
// FileHandle.stat method.

import { open } from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert'
import tmpdir from '../common/tmpdir'
import common from '../common'

tmpdir.refresh()

async function validateStat() {
  const filePath = path.resolve(tmpdir.path, 'tmp-read-file.txt')
  const fileHandle = await open(filePath, 'w+')
  const stats = await fileHandle.stat()
  assert.ok(stats.mtime instanceof Date)
  await fileHandle.close()
}

validateStat()
  .then(common.mustCall())
