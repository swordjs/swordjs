// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import path from 'node:path'
import common from '../common'

const __filename = args[0]

assert.strictEqual(path.dirname(__filename).substr(-13),
  common.isWindows ? 'test\\path' : 'test/path')

assert.strictEqual(path.posix.dirname('/a/b/'), '/a')
assert.strictEqual(path.posix.dirname('/a/b'), '/a')
assert.strictEqual(path.posix.dirname('/a'), '/')
assert.strictEqual(path.posix.dirname(''), '.')
assert.strictEqual(path.posix.dirname('/'), '/')
assert.strictEqual(path.posix.dirname('////'), '/')
assert.strictEqual(path.posix.dirname('//a'), '//')
assert.strictEqual(path.posix.dirname('foo'), '.')
/*
assert.strictEqual(path.win32.dirname('c:\\'), 'c:\\');
assert.strictEqual(path.win32.dirname('c:\\foo'), 'c:\\');
assert.strictEqual(path.win32.dirname('c:\\foo\\'), 'c:\\');
assert.strictEqual(path.win32.dirname('c:\\foo\\bar'), 'c:\\foo');
assert.strictEqual(path.win32.dirname('c:\\foo\\bar\\'), 'c:\\foo');
assert.strictEqual(path.win32.dirname('c:\\foo\\bar\\baz'), 'c:\\foo\\bar');
assert.strictEqual(path.win32.dirname('c:\\foo bar\\baz'), 'c:\\foo bar');
assert.strictEqual(path.win32.dirname('\\'), '\\');
assert.strictEqual(path.win32.dirname('\\foo'), '\\');
assert.strictEqual(path.win32.dirname('\\foo\\'), '\\');
assert.strictEqual(path.win32.dirname('\\foo\\bar'), '\\foo');
assert.strictEqual(path.win32.dirname('\\foo\\bar\\'), '\\foo');
assert.strictEqual(path.win32.dirname('\\foo\\bar\\baz'), '\\foo\\bar');
assert.strictEqual(path.win32.dirname('\\foo bar\\baz'), '\\foo bar');
assert.strictEqual(path.win32.dirname('c:'), 'c:');
assert.strictEqual(path.win32.dirname('c:foo'), 'c:');
assert.strictEqual(path.win32.dirname('c:foo\\'), 'c:');
assert.strictEqual(path.win32.dirname('c:foo\\bar'), 'c:foo');
assert.strictEqual(path.win32.dirname('c:foo\\bar\\'), 'c:foo');
assert.strictEqual(path.win32.dirname('c:foo\\bar\\baz'), 'c:foo\\bar');
assert.strictEqual(path.win32.dirname('c:foo bar\\baz'), 'c:foo bar');
assert.strictEqual(path.win32.dirname('file:stream'), '.');
assert.strictEqual(path.win32.dirname('dir\\file:stream'), 'dir');
assert.strictEqual(path.win32.dirname('\\\\unc\\share'),
                   '\\\\unc\\share');
assert.strictEqual(path.win32.dirname('\\\\unc\\share\\foo'),
                   '\\\\unc\\share\\');
assert.strictEqual(path.win32.dirname('\\\\unc\\share\\foo\\'),
                   '\\\\unc\\share\\');
assert.strictEqual(path.win32.dirname('\\\\unc\\share\\foo\\bar'),
                   '\\\\unc\\share\\foo');
assert.strictEqual(path.win32.dirname('\\\\unc\\share\\foo\\bar\\'),
                   '\\\\unc\\share\\foo');
assert.strictEqual(path.win32.dirname('\\\\unc\\share\\foo\\bar\\baz'),
                   '\\\\unc\\share\\foo\\bar');
assert.strictEqual(path.win32.dirname('/a/b/'), '/a');
assert.strictEqual(path.win32.dirname('/a/b'), '/a');
assert.strictEqual(path.win32.dirname('/a'), '/');
assert.strictEqual(path.win32.dirname(''), '.');
assert.strictEqual(path.win32.dirname('/'), '/');
assert.strictEqual(path.win32.dirname('////'), '/');
assert.strictEqual(path.win32.dirname('foo'), '.');
*/
