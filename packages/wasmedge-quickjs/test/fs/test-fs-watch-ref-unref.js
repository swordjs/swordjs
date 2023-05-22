// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import fs from 'node:fs'
import common from '../common'

if (common.isIBMi)
  common.skip('IBMi does not support `fs.watch()`')

const watcher = fs.watch(__filename, common.mustNotCall())

watcher.unref()

setTimeout(
  common.mustCall(() => {
    watcher.ref()
    watcher.unref()
  }),
  common.platformTimeout(100),
)
