// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'
import common from '../common'

[false, 1, [], {}, null, undefined].forEach((i) => {
  assert.throws(
    () => fs.rmdir(i, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    },
  )
  assert.throws(
    () => fs.rmdirSync(i),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    },
  )
})
