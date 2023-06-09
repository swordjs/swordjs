// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

// The following tests validate base functionality for the fs.promises
// FileHandle.readFile method.

import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert'
import tmpdir from '../common/tmpdir'
// import tick from '../common/tick';
import common from '../common'

const {
  open,
  readFile,
  writeFile,
  truncate,
} = fs.promises
const tmpDir = tmpdir.path

tmpdir.refresh()

async function validateReadFile() {
  const filePath = path.resolve(tmpDir, 'tmp-read-file.txt')
  const fileHandle = await open(filePath, 'w+')
  const buffer = Buffer.from('Hello world'.repeat(100), 'utf8')

  const fd = fs.openSync(filePath, 'w+')
  fs.writeSync(fd, buffer, 0, buffer.length)
  fs.closeSync(fd)

  const readFileData = await fileHandle.readFile()
  assert.deepStrictEqual(buffer, readFileData)

  await fileHandle.close()
}

async function validateReadFileProc() {
  // Test to make sure reading a file under the /proc directory works. Adapted
  // from test-fs-read-file-sync-hostname.js.
  // Refs:
  // - https://groups.google.com/forum/#!topic/nodejs-dev/rxZ_RoH1Gn0
  // - https://github.com/nodejs/node/issues/21331

  // Test is Linux-specific.
  if (!common.isLinux)
    return

  const fileHandle = await open('/proc/sys/kernel/hostname', 'r')
  const hostname = await fileHandle.readFile()
  assert.ok(hostname.length > 0)
}

async function doReadAndCancel() {
  // unsupport AbortController
  /*
  // Signal aborted from the start
  {
    const filePathForHandle = path.resolve(tmpDir, 'dogs-running.txt');
    const fileHandle = await open(filePathForHandle, 'w+');
    try {
      const buffer = Buffer.from('Dogs running'.repeat(10000), 'utf8');
      fs.writeFileSync(filePathForHandle, buffer);
      const signal = AbortSignal.abort();
      await assert.rejects(readFile(fileHandle, common.mustNotMutateObjectDeep({ signal })), {
        name: 'AbortError'
      });
    } finally {
      await fileHandle.close();
    }
  }

  // Signal aborted on first tick
  {
    const filePathForHandle = path.resolve(tmpDir, 'dogs-running1.txt');
    const fileHandle = await open(filePathForHandle, 'w+');
    const buffer = Buffer.from('Dogs running'.repeat(10000), 'utf8');
    fs.writeFileSync(filePathForHandle, buffer);
    const controller = new AbortController();
    const { signal } = controller;
    process.nextTick(() => controller.abort());
    await assert.rejects(readFile(fileHandle, common.mustNotMutateObjectDeep({ signal })), {
      name: 'AbortError'
    }, 'tick-0');
    await fileHandle.close();
  }

  // Signal aborted right before buffer read
  {
    const newFile = path.resolve(tmpDir, 'dogs-running2.txt');
    const buffer = Buffer.from('Dogs running'.repeat(1000), 'utf8');
    fs.writeFileSync(newFile, buffer);

    const fileHandle = await open(newFile, 'r');

    const controller = new AbortController();
    const { signal } = controller;
    tick(1, () => controller.abort());
    await assert.rejects(fileHandle.readFile(common.mustNotMutateObjectDeep({ signal, encoding: 'utf8' })), {
      name: 'AbortError'
    }, 'tick-1');

    await fileHandle.close();
  } */

  // Validate file size is within range for reading
  {
    // Variable taken from https://github.com/nodejs/node/blob/1377163f3351/lib/internal/fs/promises.js#L5
    const kIoMaxLength = 2 ** 31 - 1

    const newFile = path.resolve(tmpDir, 'dogs-running3.txt')
    await writeFile(newFile, Buffer.from('0'))
    await truncate(newFile, kIoMaxLength + 1)

    const fileHandle = await open(newFile, 'r')

    await assert.rejects(fileHandle.readFile(), {
      name: 'RangeError',
      code: 'ERR_FS_FILE_TOO_LARGE',
    })
    await fileHandle.close()
  }
}

validateReadFile()
  .then(validateReadFileProc)
  .then(doReadAndCancel)
  .then(common.mustCall())
