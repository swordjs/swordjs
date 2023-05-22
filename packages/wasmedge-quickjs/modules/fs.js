import promises from './fs/promises'

import {
  Dir,
  Dirent,
  FileHandle,
  ReadStream,
  WriteStream,
  access,
  accessSync,
  appendFile,
  appendFileSync,
  chmod,
  chmodSync,
  chown,
  chownSync,
  close,
  closeSync,
  constants,
  copyFile,
  copyFileSync,
  cp,
  cpSync,
  createReadStream,
  createWriteStream,
  exists,
  existsSync,
  fchmod,
  fchmodSync,
  fchown,
  fchownSync,
  fdatasync,
  fdatasyncSync,
  fstat,
  fstatSync,
  fsync,
  fsyncSync,
  ftruncate,
  ftruncateSync,
  futimes,
  futimesSync,
  lchmod,
  lchmodSync,
  lchown,
  lchownSync,
  link,
  linkSync,
  lstat,
  lstatSync,
  lutimes,
  lutimesSync,
  mkdir,
  mkdirSync,
  mkdtemp,
  mkdtempSync,
  open,
  openSync,
  opendir,
  opendirSync,
  read,
  readFile,
  readFileSync,
  readSync,
  readdir,
  readdirSync,
  readlink,
  readlinkSync,
  readv,
  readvSync,
  realpath,
  realpathSync,
  rename,
  renameSync,
  rm,
  rmSync,
  rmdir,
  rmdirSync,
  stat,
  statSync,
  symlink,
  symlinkSync,
  truncate,
  truncateSync,
  unlink,
  unlinkSync,
  unwatch,
  utimes,
  utimesSync,
  watch,
  watchFile,
  write,
  writeFile,
  writeFileSync,
  writeSync,
  writev,
  writevSync,
} from './internal/fs'

export default {
  F_OK: constants.F_OK,
  R_OK: constants.R_OK,
  W_OK: constants.W_OK,
  X_OK: constants.X_OK,
  promises,
  stat,
  statSync,
  lstat,
  lstatSync,
  fstat,
  fstatSync,
  access,
  accessSync,
  exists,
  existsSync,
  mkdir,
  mkdirSync,
  fchown,
  fchownSync,
  chown,
  chownSync,
  lchown,
  lchownSync,
  rmdir,
  rmdirSync,
  rm,
  rmSync,
  fchmod,
  fchmodSync,
  lchmod,
  lchmodSync,
  chmod,
  chmodSync,
  futimes,
  futimesSync,
  lutimes,
  lutimesSync,
  utimes,
  utimesSync,
  rename,
  renameSync,
  unlink,
  unlinkSync,
  truncate,
  truncateSync,
  ftruncate,
  ftruncateSync,
  realpath,
  realpathSync,
  mkdtemp,
  mkdtempSync,
  copyFile,
  copyFileSync,
  link,
  linkSync,
  symlink,
  symlinkSync,
  close,
  closeSync,
  fdatasync,
  fdatasyncSync,
  fsync,
  fsyncSync,
  read,
  readSync,
  open,
  openSync,
  readFile,
  readFileSync,
  readlink,
  readlinkSync,
  readv,
  readvSync,
  write,
  writeSync,
  writeFile,
  writeFileSync,
  appendFile,
  appendFileSync,
  writev,
  writevSync,
  opendir,
  opendirSync,
  Dir,
  Dirent,
  readdir,
  readdirSync,
  watch,
  watchFile,
  unwatch,
  cp,
  cpSync,
  createWriteStream,
  WriteStream,
  createReadStream,
  ReadStream,
  FileHandle,
  constants,
}

const F_OK = constants.F_OK
const R_OK = constants.R_OK
const W_OK = constants.W_OK
const X_OK = constants.X_OK

export {
  F_OK,
  R_OK,
  W_OK,
  X_OK,
  promises,
  stat,
  statSync,
  lstat,
  lstatSync,
  fstat,
  fstatSync,
  access,
  accessSync,
  exists,
  existsSync,
  mkdir,
  mkdirSync,
  fchown,
  fchownSync,
  chown,
  chownSync,
  lchown,
  lchownSync,
  rmdir,
  rmdirSync,
  rm,
  rmSync,
  fchmod,
  fchmodSync,
  lchmod,
  lchmodSync,
  chmod,
  chmodSync,
  futimes,
  futimesSync,
  lutimes,
  lutimesSync,
  utimes,
  utimesSync,
  rename,
  renameSync,
  unlink,
  unlinkSync,
  truncate,
  truncateSync,
  ftruncate,
  ftruncateSync,
  realpath,
  realpathSync,
  mkdtemp,
  mkdtempSync,
  copyFile,
  copyFileSync,
  link,
  linkSync,
  symlink,
  symlinkSync,
  close,
  closeSync,
  fdatasync,
  fdatasyncSync,
  fsync,
  fsyncSync,
  read,
  readSync,
  open,
  openSync,
  readFile,
  readFileSync,
  readlink,
  readlinkSync,
  readv,
  readvSync,
  write,
  writeSync,
  writeFile,
  writeFileSync,
  appendFile,
  appendFileSync,
  writev,
  writevSync,
  opendir,
  opendirSync,
  Dir,
  Dirent,
  readdir,
  readdirSync,
  watch,
  watchFile,
  unwatch,
  cp,
  cpSync,
  createWriteStream,
  WriteStream,
  createReadStream,
  ReadStream,
  FileHandle,
  constants,
}
