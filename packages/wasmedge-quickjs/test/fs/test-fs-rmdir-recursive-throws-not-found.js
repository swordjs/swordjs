// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import tmpdir from '../common/tmpdir'
import common from '../common'

tmpdir.refresh()

{
  assert.throws(
    () =>
      fs.rmdirSync(path.join(tmpdir.path, 'noexist.txt'), { recursive: true }),
    {
      code: 'ENOENT',
    },
  )
}
{
  fs.rmdir(
    path.join(tmpdir.path, 'noexist.txt'),
    { recursive: true },
    common.mustCall((err) => {
      assert.strictEqual(err.code, 'ENOENT')
    }),
  )
}
{
  assert.rejects(
    () => fs.promises.rmdir(path.join(tmpdir.path, 'noexist.txt'),
      { recursive: true }),
    {
      code: 'ENOENT',
    },
  ).then(common.mustCall())
}
