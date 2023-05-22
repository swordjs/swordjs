// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'
import { mustNotMutateObjectDeep } from '../common'

{
  const fd = 'k'

  assert.throws(
    () => {
      fs.createReadStream(null, mustNotMutateObjectDeep({ fd }))
    },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    })

  assert.throws(
    () => {
      fs.createWriteStream(null, mustNotMutateObjectDeep({ fd }))
    },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    })
}

{
  const path = 46

  assert.throws(
    () => {
      fs.createReadStream(path)
    },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    })

  assert.throws(
    () => {
      fs.createWriteStream(path)
    },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    })
}
