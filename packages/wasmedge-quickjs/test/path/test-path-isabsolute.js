// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'
import assert from 'node:assert'
import path from 'node:path'
/*
assert.strictEqual(path.win32.isAbsolute('/'), true);
assert.strictEqual(path.win32.isAbsolute('//'), true);
assert.strictEqual(path.win32.isAbsolute('//server'), true);
assert.strictEqual(path.win32.isAbsolute('//server/file'), true);
assert.strictEqual(path.win32.isAbsolute('\\\\server\\file'), true);
assert.strictEqual(path.win32.isAbsolute('\\\\server'), true);
assert.strictEqual(path.win32.isAbsolute('\\\\'), true);
assert.strictEqual(path.win32.isAbsolute('c'), false);
assert.strictEqual(path.win32.isAbsolute('c:'), false);
assert.strictEqual(path.win32.isAbsolute('c:\\'), true);
assert.strictEqual(path.win32.isAbsolute('c:/'), true);
assert.strictEqual(path.win32.isAbsolute('c://'), true);
assert.strictEqual(path.win32.isAbsolute('C:/Users/'), true);
assert.strictEqual(path.win32.isAbsolute('C:\\Users\\'), true);
assert.strictEqual(path.win32.isAbsolute('C:cwd/another'), false);
assert.strictEqual(path.win32.isAbsolute('C:cwd\\another'), false);
assert.strictEqual(path.win32.isAbsolute('directory/directory'), false);
assert.strictEqual(path.win32.isAbsolute('directory\\directory'), false);
*/
assert.strictEqual(path.posix.isAbsolute('/home/foo'), true)
assert.strictEqual(path.posix.isAbsolute('/home/foo/..'), true)
assert.strictEqual(path.posix.isAbsolute('bar/'), false)
assert.strictEqual(path.posix.isAbsolute('./baz'), false)
