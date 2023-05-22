// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import assert from 'node:assert'
import path from 'node:path'
import fs from 'node:fs'
import common from '../common'

import tmpdir from '../common/tmpdir'

// Test creating a symbolic link pointing to a directory.
// Ref: https://github.com/nodejs/node/pull/23724
// Ref: https://github.com/nodejs/node/issues/23596

if (!common.canCreateSymLink())
  common.skip('insufficient privileges')
tmpdir.refresh()

const linkTargets = [
  'relative-target',
  // path.join(tmpdir.path, 'absolute-target'),
]
const linkPaths = [
  // path.relative("./", path.join(tmpdir.path, 'relative-path')),
  path.join(tmpdir.path, 'relative-path'),
  // path.join(tmpdir.path, 'absolute-path'),
]

function testSync(target, path) {
  fs.symlinkSync(target, path)
  fs.readdirSync(path)
}

function testAsync(target, path) {
  fs.symlink(target, path, common.mustSucceed(() => {
    fs.readdirSync(path)
  }))
}

for (const linkTarget of linkTargets) {
  fs.mkdirSync(path.resolve(tmpdir.path, linkTarget))
  for (const linkPath of linkPaths) {
    testSync(linkTarget, `${linkPath}-${path.basename(linkTarget)}-sync`)
    testAsync(linkTarget, `${linkPath}-${path.basename(linkTarget)}-async`)
  }
}

// Test invalid symlink
{
  function testSync(target, path) {
    fs.symlinkSync(target, path)
    assert(!fs.existsSync(path))
  }

  function testAsync(target, path) {
    fs.symlink(target, path, common.mustSucceed(() => {
      assert(!fs.existsSync(path))
    }))
  }

  for (const linkTarget of linkTargets.map(p => `${p}-broken`)) {
    for (const linkPath of linkPaths) {
      testSync(linkTarget, `${linkPath}-${path.basename(linkTarget)}-sync`)
      testAsync(linkTarget, `${linkPath}-${path.basename(linkTarget)}-async`)
    }
  }
}
