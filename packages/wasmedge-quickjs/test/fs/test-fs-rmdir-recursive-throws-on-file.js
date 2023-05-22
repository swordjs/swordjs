// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import tmpdir from '../common/tmpdir'
import common from '../common'

tmpdir.refresh()

const code = common.isWindows ? 'ENOENT' : 'ENOTDIR'

{
  const filePath = path.join(tmpdir.path, 'rmdir-recursive.txt')
  fs.writeFileSync(filePath, '')
  assert.throws(() => fs.rmdirSync(filePath, { recursive: true }), { code })
}
{
  const filePath = path.join(tmpdir.path, 'rmdir-recursive.txt')
  fs.writeFileSync(filePath, '')
  fs.rmdir(filePath, { recursive: true }, common.mustCall((err) => {
    assert.strictEqual(err.code, code)
  }))
}
{
  const filePath = path.join(tmpdir.path, 'rmdir-recursive.txt')
  fs.writeFileSync(filePath, '')
  assert.rejects(() => fs.promises.rmdir(filePath, { recursive: true }),
    { code }).then(common.mustCall())
}
