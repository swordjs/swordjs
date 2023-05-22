// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'

import { spawnSync } from 'node:child_process'
import common from '../common'

if (common.isWindows || common.isAIX)
  common.skip(`No /dev/stdin on ${process.platform}.`)

for (const code of [
  `require('fs').realpath('/dev/stdin', (err, resolvedPath) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    if (resolvedPath) {
      process.exit(2);
    }
  });`,
  `try {
    if (require('fs').realpathSync('/dev/stdin')) {
      process.exit(2);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }`,
]) {
  const child = spawnSync(process.execPath, ['-e', code], {
    stdio: 'pipe',
  })
  if (child.status !== 2) {
    console.log(code)
    console.log(child.stderr.toString())
  }
  assert.strictEqual(child.status, 2)
}
