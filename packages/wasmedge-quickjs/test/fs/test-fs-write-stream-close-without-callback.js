// Copyright Joyent and Node contributors. All rights reserved. MIT license.
'use strict'

import fs from 'node:fs'
import path from 'node:path'

import tmpdir from '../common/tmpdir'

tmpdir.refresh()

const s = fs.createWriteStream(path.join(tmpdir.path, 'nocallback'))

s.end('hello world')
s.close()
