import { accessSync, constants, existsSync, lstatSync, mkdirSync, openSync, read, readFileSync, renameSync, rmSync, rmdirSync, statSync } from 'node:fs'

print('\nfs.statSync\nExisted File:')

try {
  const s = statSync('README.md')
  print(JSON.stringify(s))
}
catch (err) {
  print(JSON.stringify(err))
}

print('\nExisted File with BigInt:')

try {
  const s = statSync('README.md', { bigint: true })
  for (const [key, val] of Object.entries(s))
    print(key, ': ', typeof (val) === 'function' ? val() : val)
}
catch (err) {
  print(JSON.stringify(err))
}

print('\nNon-existed File')

try {
  const s = statSync('non-exist.file')
  print(JSON.stringify(s))
}
catch (err) {
  print(err.name)
  print(err.stack)
  print(err.message)
}

print('\nNon-existed File No Throw')

{
  const s = statSync('non-exist.file', { throwIfNoEntry: false })
  print(s)
}

print('\nfs.constants:')

const { F_OK, O_WRONLY } = constants
print('F_OK: ', F_OK)
print('O_WRONLY: ', O_WRONLY)

print('\nfs.lstatSync\nExisted File:')

try {
  const s = lstatSync('README.md')
  print(JSON.stringify(s))
}
catch (err) {
  print(JSON.stringify(err))
}

print('\nExisted File with BigInt:')

try {
  const s = lstatSync('README.md', { bigint: true })
  for (const [key, val] of Object.entries(s))
    print(key, ': ', typeof (val) === 'function' ? val() : val)
}
catch (err) {
  print(JSON.stringify(err))
}

print('\nNon-existed File:')

try {
  const s = lstatSync('non-exist.file')
  print(JSON.stringify(s))
}
catch (err) {
  print(err.name)
  print(err.stack)
  print(err.message)
}

print('\nNon-existed File with No Throw:')

{
  const s = lstatSync('non-exist.file', { throwIfNoEntry: false })
  print(s)
}

function assert(fn) {
  if (!fn)
    throw new Error()
}

print('\nmkdir: ./tmpdir')
mkdirSync('./tmpdir')
print('access: ./tmpdir')
accessSync('./tmpdir')
print('rmdir: ./tmpdir')
rmdirSync('./tmpdir')
print('exist: ./tmpdir')
print(existsSync('./tmpdir'))

print('\nmkdir recursive: ./tmpdir/subdir')
mkdirSync('./tmpdir/subdir', { recursive: true })
print('access: ./tmpdir/subdir')
accessSync('./tmpdir/subdir')
print('rm recursive: ./tmpdir')
rmSync('./tmpdir', { recursive: true })
print('exist: ./tmpdir')
print(existsSync('./tmpdir'))

print('\nrename README.md to test.md')
renameSync('./README.md', './test.md')
print('exist: ./test.md')
print(existsSync('./test.md'))
renameSync('./test.md', './README.md')

const fd = openSync('./README.md')
print(fd)
read(fd, { length: 20 }, (err, len, buf) => {
  print(err)
  print(len)
  print(buf.toString())
})

print(readFileSync('./Cargo.toml', 'utf-8'))
