// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import fs from 'node:fs'
import common from '../common'

// This test ensures that input for fchmod is valid, testing for valid
// inputs for fd and mode

// Check input type
[false, null, undefined, {}, [], ''].forEach((input) => {
  const errObj = {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: `The "fd" argument must be of type number.${
             common.invalidArgTypeHelper(input)}`,
  }
  assert.throws(() => fs.fchmod(input), errObj)
  assert.throws(() => fs.fchmodSync(input), errObj)
});

[false, null, {}, []].forEach((input) => {
  const errObj = {
    code: 'ERR_INVALID_ARG_TYPE',
  }
  assert.throws(() => fs.fchmod(1, input), errObj)
  assert.throws(() => fs.fchmodSync(1, input), errObj)
})

assert.throws(() => fs.fchmod(1, '123x'), {
  code: 'ERR_INVALID_ARG_VALUE',
});

[-1, 2 ** 32].forEach((input) => {
  const errObj = {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "fd" is out of range. It must be >= 0 && <= '
             + `2147483647. Received ${input}`,
  }
  assert.throws(() => fs.fchmod(input), errObj)
  assert.throws(() => fs.fchmodSync(input), errObj)
});

[-1, 2 ** 32].forEach((input) => {
  const errObj = {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "mode" is out of range. It must be >= 0 && <= '
             + `4294967295. Received ${input}`,
  }

  assert.throws(() => fs.fchmod(1, input), errObj)
  assert.throws(() => fs.fchmodSync(1, input), errObj)
});

[NaN, Infinity].forEach((input) => {
  const errObj = {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "fd" is out of range. It must be an integer. '
             + `Received ${input}`,
  }
  assert.throws(() => fs.fchmod(input), errObj)
  assert.throws(() => fs.fchmodSync(input), errObj)
  errObj.message = errObj.message.replace('fd', 'mode')
  assert.throws(() => fs.fchmod(1, input), errObj)
  assert.throws(() => fs.fchmodSync(1, input), errObj)
});

[1.5].forEach((input) => {
  const errObj = {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "fd" is out of range. It must be an integer. '
             + `Received ${input}`,
  }
  assert.throws(() => fs.fchmod(input), errObj)
  assert.throws(() => fs.fchmodSync(input), errObj)
  errObj.message = errObj.message.replace('fd', 'mode')
  assert.throws(() => fs.fchmod(1, input), errObj)
  assert.throws(() => fs.fchmodSync(1, input), errObj)
})
