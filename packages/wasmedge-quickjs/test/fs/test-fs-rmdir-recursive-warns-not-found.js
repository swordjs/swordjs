// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import fs from 'node:fs'
import path from 'node:path'
import common from '../common'
import tmpdir from '../common/tmpdir'

tmpdir.refresh()

{
  // Should warn when trying to delete a nonexistent path
  common.expectWarning(
    'DeprecationWarning',
    'In future versions of Node.js, fs.rmdir(path, { recursive: true }) '
      + 'will be removed. Use fs.rm(path, { recursive: true }) instead',
    'DEP0147',
  )
  fs.rmdir(
    path.join(tmpdir.path, 'noexist.txt'),
    { recursive: true },
    common.mustCall(),
  )
}
