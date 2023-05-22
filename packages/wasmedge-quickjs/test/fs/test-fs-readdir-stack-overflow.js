// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'

function recurse() {
  fs.readdirSync('.')
  recurse()
}

assert.throws(
  () => recurse(),
  {
    name: 'RangeError',
    message: 'Maximum call stack size exceeded',
  },
)
