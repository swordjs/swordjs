function unimplemented(name) {
  throw new Error(`Node.js process ${name} is not supported`)
}

const title = 'wasmedge_quickjs'
const arch = 'wasm'
const platform = 'wasi'
const env = globalThis.env
const argv = globalThis.argv
const execArgv = []
const version = 'v16.8.0'
const versions = {}

const emitWarning = function (message, type) {
  console.warn((type ? (`${type}: `) : '') + message)
}

const binding = function (name) { unimplemented('binding') }

const umask = function (mask) { return 0 }

const cwd = function () { return './' }
const chdir = function (dir) { unimplemented('chdir') }

const release = {
  name: 'wasmedge_quickjs',
  sourceUrl: '',
  headersUrl: '',
  libUrl: '',
}

function noop() { }

const _rawDebug = noop
const moduleLoadList = []
function _linkedBinding(name) { unimplemented('_linkedBinding') }
const domain = {}
const _exiting = false
const config = {}
function dlopen(name) { unimplemented('dlopen') }
function _getActiveRequests() { return [] }
function _getActiveHandles() { return [] }
const reallyExit = noop
const _kill = noop
const cpuUsage = function () { return {} }
const resourceUsage = cpuUsage
const memoryUsage = cpuUsage
const kill = noop
const exit = globalThis.exit
const openStdin = noop
const allowedNodeEnvironmentFlags = {}
function assert(condition, message) {
  if (!condition)
    throw new Error(message || 'assertion error')
}
const features = {
  inspector: false,
  debug: false,
  uv: false,
  ipv6: false,
  tls_alpn: false,
  tls_sni: false,
  tls_ocsp: false,
  tls: false,
  cached_builtins: true,
}
const _fatalExceptions = noop
const setUncaughtExceptionCaptureCallback = noop
function hasUncaughtExceptionCaptureCallback() { return false } const _tickCallback = noop
const _debugProcess = noop
const _debugEnd = noop
const _startProfilerIdleNotifier = noop
const _stopProfilerIdleNotifier = noop
const stdout = undefined
const stderr = undefined
const stdin = undefined
const abort = noop
const pid = 2
const ppid = 1
const execPath = 'wasmedge-quickjs'
const debugPort = 9229
const argv0 = 'wasmedge-quickjs'
const _preload_modules = []
const setSourceMapsEnabled = noop

const _performance = {
  now: undefined,
  timing: undefined,
}
if (_performance.now === undefined) {
  let nowOffset = Date.now()

  if (_performance.timing && _performance.timing.navigationStart)
    nowOffset = _performance.timing.navigationStart

  _performance.now = function () { return Date.now() - nowOffset }
}

function uptime() {
  return _performance.now() / 1000
}

const nanoPerSec = 1000000000
function hrtime(previousTimestamp) {
  const baseNow = Math.floor((Date.now() - _performance.now()) * 1e-3)
  const clocktime = _performance.now() * 1e-3
  let seconds = Math.floor(clocktime) + baseNow
  let nanoseconds = Math.floor((clocktime % 1) * 1e9)
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0]
    nanoseconds = nanoseconds - previousTimestamp[1]
    if (nanoseconds < 0) {
      seconds--
      nanoseconds += nanoPerSec
    }
  }
  return [seconds, nanoseconds]
}

hrtime.bigint = function (time) {
  const diff = hrtime(time)
  if (typeof BigInt === 'undefined')
    return diff[0] * nanoPerSec + diff[1]

  return BigInt(diff[0] * nanoPerSec) + BigInt(diff[1])
}

const _maxListeners = 10
const _events = {}
const _eventsCount = 0
function on() { return process } const addListener = on
const once = on
const off = on
const removeListener = on
const removeAllListeners = on
const emit = noop
const prependListener = on
const prependOnceListener = on
function listeners(name) { return [] }
var process = {
  version,
  versions,
  arch,
  platform,
  release,
  _rawDebug,
  moduleLoadList,
  binding,
  _linkedBinding,
  _events,
  _eventsCount,
  _maxListeners,
  on,
  addListener,
  once,
  off,
  removeListener,
  removeAllListeners,
  emit,
  prependListener,
  prependOnceListener,
  listeners,
  domain,
  _exiting,
  config,
  dlopen,
  uptime,
  _getActiveRequests,
  _getActiveHandles,
  reallyExit,
  _kill,
  cpuUsage,
  resourceUsage,
  memoryUsage,
  kill,
  exit,
  openStdin,
  allowedNodeEnvironmentFlags,
  assert,
  features,
  _fatalExceptions,
  setUncaughtExceptionCaptureCallback,
  hasUncaughtExceptionCaptureCallback,
  emitWarning,
  nextTick: globalThis.nextTick,
  _tickCallback,
  _debugProcess,
  _debugEnd,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  stdout,
  stdin,
  stderr,
  abort,
  umask,
  chdir,
  cwd,
  env,
  title,
  argv,
  execArgv,
  pid,
  ppid,
  execPath,
  debugPort,
  hrtime,
  argv0,
  _preload_modules,
  setSourceMapsEnabled,
}

const nextTick = globalThis.nextTick

export { _debugEnd, _debugProcess, _events, _eventsCount, _exiting, _fatalExceptions, _getActiveHandles, _getActiveRequests, _kill, _linkedBinding, _maxListeners, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, assert, binding, chdir, config, cpuUsage, cwd, debugPort, process as default, dlopen, domain, emit, emitWarning, env, execArgv, execPath, exit, features, hasUncaughtExceptionCaptureCallback, hrtime, kill, listeners, memoryUsage, moduleLoadList, nextTick, off, on, once, openStdin, pid, platform, ppid, prependListener, prependOnceListener, reallyExit, release, removeAllListeners, removeListener, resourceUsage, setSourceMapsEnabled, setUncaughtExceptionCaptureCallback, stderr, stdin, stdout, title, umask, uptime, version, versions }
