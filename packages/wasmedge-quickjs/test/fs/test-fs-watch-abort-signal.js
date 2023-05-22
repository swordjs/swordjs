// Copyright Joyent and Node contributors. All rights reserved. MIT license.
// Flags: --expose-internals
'use strict'

// Verify that AbortSignal integration works for fs.watch

import fs from 'node:fs'
import common from '../common'

import fixtures from '../common/fixtures'

if (common.isIBMi)
  common.skip('IBMi does not support `fs.watch()`')

{
  // Signal aborted after creating the watcher
  const file = fixtures.path('empty.js')
  const ac = new AbortController()
  const { signal } = ac
  const watcher = fs.watch(file, { signal })
  watcher.once('close', common.mustCall())
  setImmediate(() => ac.abort())
}
{
  // Signal aborted before creating the watcher
  const file = fixtures.path('empty.js')
  const signal = AbortSignal.abort()
  const watcher = fs.watch(file, { signal })
  watcher.once('close', common.mustCall())
}
