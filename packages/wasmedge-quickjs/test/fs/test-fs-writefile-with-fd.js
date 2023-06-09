// Copyright Joyent and Node contributors. All rights reserved. MIT license.

'use strict'

// This test makes sure that `writeFile()` always writes from the current
// position of the file, instead of truncating the file, when used with file
// descriptors.

import assert from 'node:assert'
import fs from 'node:fs'
import { join } from 'node:path'
import common from '../common'

import tmpdir from '../common/tmpdir'

tmpdir.refresh()

{
  /* writeFileSync() test. */
  const filename = join(tmpdir.path, 'test.txt')

  /* Open the file descriptor. */
  const fd = fs.openSync(filename, 'w')
  try {
    /* Write only five characters, so that the position moves to five. */
    assert.strictEqual(fs.writeSync(fd, 'Hello'), 5)
    assert.strictEqual(fs.readFileSync(filename).toString(), 'Hello')

    /* Write some more with writeFileSync(). */
    fs.writeFileSync(fd, 'World')

    /* New content should be written at position five, instead of zero. */
    assert.strictEqual(fs.readFileSync(filename).toString(), 'HelloWorld')
  }
  finally {
    fs.closeSync(fd)
  }
}

const fdsToCloseOnExit = []
globalThis.commonExitCheck = common.mustCall(() => {
  for (const fd of fdsToCloseOnExit) {
    try {
      fs.closeSync(fd)
    }
    catch {
      // Failed to close, ignore
    }
  }
})

{
  /* writeFile() test. */
  const file = join(tmpdir.path, 'test1.txt')

  /* Open the file descriptor. */
  fs.open(file, 'w', common.mustSucceed((fd) => {
    fdsToCloseOnExit.push(fd)
    /* Write only five characters, so that the position moves to five. */
    fs.write(fd, 'Hello', common.mustSucceed((bytes) => {
      assert.strictEqual(bytes, 5)
      assert.strictEqual(fs.readFileSync(file).toString(), 'Hello')

      /* Write some more with writeFile(). */
      fs.writeFile(fd, 'World', common.mustSucceed(() => {
        /* New content should be written at position five, instead of zero. */
        assert.strictEqual(fs.readFileSync(file).toString(), 'HelloWorld')
      }))
    }))
  }))
}

// Test read-only file descriptor
{
  const file = join(tmpdir.path, 'test.txt')

  fs.open(file, 'r', common.mustSucceed((fd) => {
    fdsToCloseOnExit.push(fd)
    fs.writeFile(fd, 'World', common.expectsError(/EBADF/))
  }))
}
/*
// Test with an AbortSignal
{
  const controller = new AbortController();
  const signal = controller.signal;
  const file = join(tmpdir.path, 'test.txt');

  fs.open(file, 'w', common.mustSucceed((fd) => {
    fdsToCloseOnExit.push(fd);
    fs.writeFile(fd, 'World', { signal }, common.expectsError({
      name: 'AbortError'
    }));
  }));

  controller.abort();
}
*/
