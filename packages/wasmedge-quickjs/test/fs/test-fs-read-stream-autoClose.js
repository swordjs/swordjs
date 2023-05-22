// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert'
import common from '../common'
import tmpdir from '../common/tmpdir'

const writeFile = path.join(tmpdir.path, 'write-autoClose.txt')
tmpdir.refresh()

const file = fs.createWriteStream(writeFile, { autoClose: true })

file.on('finish', common.mustCall(() => {
  assert.strictEqual(file.destroyed, false)
}))
file.end('asd')
