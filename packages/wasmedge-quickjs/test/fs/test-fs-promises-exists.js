// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'

assert.strictEqual(fsPromises, fs.promises)
assert.strictEqual(fsPromises.constants, fs.constants)
