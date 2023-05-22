// Copyright Joyent and Node contributors. All rights reserved. MIT license.

'use strict'

import fs from 'node:fs'
import assert from 'node:assert'

// Check if the two constants accepted by chmod() on Windows are defined.
assert.notStrictEqual(fs.constants.S_IRUSR, undefined)
assert.notStrictEqual(fs.constants.S_IWUSR, undefined)
