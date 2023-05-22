// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'
import common from '../common'

const __filename = args[0]

const fd = fs.openSync(__filename, 'r')

fs.close(fd, common.mustCall((...args) => {
  assert.deepStrictEqual(args, [null])
}))
