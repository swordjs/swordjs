// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import fs from 'node:fs'
import assert from 'node:assert'
import common from '../common'

assert.throws(() => {
  fs.write(null, Buffer.allocUnsafe(1), 0, 1, common.mustNotCall())
}, /TypeError/)

assert.throws(() => {
  fs.write(null, '1', 0, 1, common.mustNotCall())
}, /TypeError/)
