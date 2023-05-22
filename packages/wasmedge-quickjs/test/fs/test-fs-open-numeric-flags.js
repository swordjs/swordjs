// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

import tmpdir from '../common/tmpdir'

tmpdir.refresh()

// O_WRONLY without O_CREAT shall fail with ENOENT
const pathNE = path.join(tmpdir.path, 'file-should-not-exist')
assert.throws(
  () => fs.openSync(pathNE, fs.constants.O_WRONLY),
  e => e.code === 'ENOENT',
)
