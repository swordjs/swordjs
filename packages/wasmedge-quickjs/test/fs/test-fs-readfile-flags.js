// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// Test of fs.readFile with different flags.
import fs from 'node:fs'
import assert from 'node:assert'
import path from 'node:path'
import common from '../common'
import tmpdir from '../common/tmpdir'

tmpdir.refresh()

{
  const emptyFile = path.join(tmpdir.path, 'empty.txt')
  fs.closeSync(fs.openSync(emptyFile, 'w'))

  fs.readFile(
    emptyFile,
    // With `a+` the file is created if it does not exist
    common.mustNotMutateObjectDeep({ encoding: 'utf8', flag: 'a+' }),
    common.mustCall((err, data) => { assert.strictEqual(data, '') }),
  )

  fs.readFile(
    emptyFile,
    // Like `a+` but fails if the path exists.
    common.mustNotMutateObjectDeep({ encoding: 'utf8', flag: 'ax+' }),
    common.mustCall((err, data) => { assert.strictEqual(err.code, 'EEXIST') }),
  )
}

{
  const willBeCreated = path.join(tmpdir.path, 'will-be-created')

  fs.readFile(
    willBeCreated,
    // With `a+` the file is created if it does not exist
    common.mustNotMutateObjectDeep({ encoding: 'utf8', flag: 'a+' }),
    common.mustCall((err, data) => { assert.strictEqual(data, '') }),
  )
}

{
  const willNotBeCreated = path.join(tmpdir.path, 'will-not-be-created')

  fs.readFile(
    willNotBeCreated,
    // Default flag is `r`. An exception occurs if the file does not exist.
    common.mustNotMutateObjectDeep({ encoding: 'utf8' }),
    common.mustCall((err, data) => { assert.strictEqual(err.code, 'ENOENT') }),
  )
}
