// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import fs from 'node:fs'

import assert from 'node:assert'
import common from '../common'

if (!common.isOSX)
  common.skip('this tests works only on MacOS')

fs.readdir(
  Buffer.from('/dev'),
  { withFileTypes: true, encoding: 'buffer' },
  common.mustCall((e, d) => {
    assert.strictEqual(e, null)
  }),
)
