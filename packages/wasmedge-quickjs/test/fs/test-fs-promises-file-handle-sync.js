// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import { access, copyFile, open } from 'node:fs/promises'
import path from 'node:path'
import fixtures from '../common/fixtures'
import tmpdir from '../common/tmpdir'

async function validate() {
  tmpdir.refresh()
  const dest = path.resolve(tmpdir.path, 'baz.js')
  await assert.rejects(
    copyFile(fixtures.path('baz.js'), dest, 'r'),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      message: /mode.*number.*string/,
    },
  )
  await copyFile(fixtures.path('baz.js'), dest)
  await assert.rejects(
    access(dest, 'r'),
    { code: 'ERR_INVALID_ARG_TYPE', message: /mode/ },
  )
  await access(dest)
  const handle = await open(dest, 'r+')
  await handle.datasync()
  await handle.sync()
  const buf = Buffer.from('hello world')
  await handle.write(buf)
  const ret = await handle.read(Buffer.alloc(11), 0, 11, 0)
  assert.strictEqual(ret.bytesRead, 11)
  assert.deepStrictEqual(ret.buffer, buf)
  await handle.close()
}

validate()
