// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'
import common from '../common'

const encoding = 'foo-8'
const filename = 'bar.txt'
assert.throws(
  () => fs.readFile(filename, { encoding }, common.mustNotCall()),
  { code: 'ERR_INVALID_ARG_VALUE', name: 'TypeError' },
)
