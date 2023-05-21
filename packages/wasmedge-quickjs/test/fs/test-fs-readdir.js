// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict';

import common from '../common';
import assert from 'assert';
import fs from 'fs';

import tmpdir from '../common/tmpdir';

const __filename = args[0];

const readdirDir = tmpdir.path;
const files = ['empty', 'files', 'for', 'just', 'testing'];

// Make sure tmp directory is clean
tmpdir.refresh();

// Create the necessary files
files.forEach(function(currentFile) {
  fs.closeSync(fs.openSync(`${readdirDir}/${currentFile}`, 'w'));
});

// Check the readdir Sync version
assert.deepStrictEqual(files, fs.readdirSync(readdirDir).sort());

// Check the readdir async version
fs.readdir(readdirDir, common.mustSucceed((f) => {
  assert.deepStrictEqual(files, f.sort());
}));

// readdir() on file should throw ENOTDIR
// https://github.com/joyent/node/issues/1869
assert.throws(function() {
  fs.readdirSync(__filename);
}, /Error: ENOTDIR: not a directory/);

fs.readdir(__filename, common.mustCall(function(e) {
  assert.strictEqual(e.code, 'ENOTDIR');
}));

[false, 1, [], {}, null, undefined].forEach((i) => {
  assert.throws(
    () => fs.readdir(i, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.readdirSync(i),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
});
