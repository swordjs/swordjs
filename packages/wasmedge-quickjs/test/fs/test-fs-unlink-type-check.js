// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'
import common from '../common'

[false, 1, {}, [], null, undefined].forEach((i) => {
  assert.throws(
    () => fs.unlink(i, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    },
  )
  assert.throws(
    () => fs.unlinkSync(i),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    },
  )
})
