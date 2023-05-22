// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import common from '../common'

import tmpdir from '../common/tmpdir'

tmpdir.refresh()

{
  const s = fs.createWriteStream(path.join(tmpdir.path, 'rw'))

  s.close(common.mustCall())
  s.close(common.mustCall())
}

{
  const s = fs.createWriteStream(path.join(tmpdir.path, 'rw2'))

  let emits = 0
  s.on('close', () => {
    emits++
  })

  s.close(common.mustCall(() => {
    assert.strictEqual(emits, 1)
    s.close(common.mustCall(() => {
      assert.strictEqual(emits, 1)
    }))
    process.nextTick(() => {
      s.close(common.mustCall(() => {
        assert.strictEqual(emits, 1)
      }))
    })
  }))
}

{
  const s = fs.createWriteStream(path.join(tmpdir.path, 'rw'), {
    autoClose: false,
  })

  s.close(common.mustCall())
  s.close(common.mustCall())
}
