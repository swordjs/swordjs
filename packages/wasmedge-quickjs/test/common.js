// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/* eslint-disable node-core/crypto-check */
'use strict';

import { inspect } from "internal/util/inspect";

import assert from "assert";
import process from "process";

const isWindows = process.platform === 'win32';
const isAIX = process.platform === 'aix';
const isSunOS = process.platform === 'sunos';
const isFreeBSD = process.platform === 'freebsd';
const isOpenBSD = process.platform === 'openbsd';
const isLinux = process.platform === 'linux';
const isOSX = process.platform === 'darwin';
const isPi = false;
const isMainThread = true;
const isDumbTerminal = process.env.TERM === 'dumb';

const mustCallChecks = [];

function runCallChecks() {
  if (globalThis.assertPass === false) return;

  const failed = mustCallChecks.filter(function (context) {
    if ('minimum' in context) {
      context.messageSegment = `at least ${context.minimum}`;
      return context.actual < context.minimum;
    }
    context.messageSegment = `exactly ${context.exact}`;
    return context.actual !== context.exact;
  });

  failed.forEach(function (context) {
    print(`Mismatched ${context.name} function calls. Expected ${context.messageSegment}, actual ${context.actual}.`);
    print(context.stack.split('\n').slice(2).join('\n'));
  });

  assert.strictEqual(failed.length, 0);
}

const noop = () => { };

function _mustCallInner(fn, criteria = 1, field) {
  if (typeof fn === 'number') {
    criteria = fn;
    fn = noop;
  } else if (fn === undefined) {
    fn = noop;
  }

  if (typeof criteria !== 'number')
    throw new TypeError(`Invalid ${field} value: ${criteria}`);

  const context = {
    [field]: criteria,
    actual: 0,
    stack: inspect(new Error()),
    name: fn.name || '<anonymous>'
  };

  // Add the exit listener only once to avoid listener leak warnings
  if (mustCallChecks.length === 0) {
    globalThis.commonExitCheck = runCallChecks;
  };

  mustCallChecks.push(context);

  const _return = function () { // eslint-disable-line func-style
    context.actual++;
    return fn.apply(this, arguments);
  };
  // Function instances have own properties that may be relevant.
  // Let's replicate those properties to the returned function.
  // Refs: https://tc39.es/ecma262/#sec-function-instances
  Object.defineProperties(_return, {
    name: {
      value: fn.name,
      writable: false,
      enumerable: false,
      configurable: true,
    },
    length: {
      value: fn.length,
      writable: false,
      enumerable: false,
      configurable: true,
    },
  });
  return _return;
}

export function mustCall(fn, exact) {
  return _mustCallInner(fn, exact, 'exact');
}

export function mustSucceed(fn, exact) {
  return mustCall(function (err, ...args) {
    if (err) {
      print("must succeed but got: ", err);
      print(err.stack);
    }
    assert.ifError(err);
    if (typeof fn === 'function')
      return fn.apply(this, args);
  }, exact);
}

export function mustCallAtLeast(fn, minimum) {
  return _mustCallInner(fn, minimum, 'minimum');
}

export function mustNotCall(msg) {
  const callSite = new Error().stack;
  return function mustNotCall(...args) {
    const argsInfo = args.length > 0 ?
      `\ncalled with arguments: ${args.map((arg) => inspect(arg)).join(', ')}` : '';
    assert.fail(
      `${msg || 'function should not have been called'} at ${callSite}` +
      argsInfo);
  };
}

const _mustNotMutateObjectDeepProxies = new WeakMap();

export function mustNotMutateObjectDeep(original) {
  // Return primitives and functions directly. Primitives are immutable, and
  // proxied functions are impossible to compare against originals, e.g. with
  // `assert.deepEqual()`.
  if (original === null || typeof original !== 'object') {
    return original;
  }

  const cachedProxy = _mustNotMutateObjectDeepProxies.get(original);
  if (cachedProxy) {
    return cachedProxy;
  }

  const _mustNotMutateObjectDeepHandler = {
    __proto__: null,
    defineProperty(target, property, descriptor) {
      assert.fail(`Expected no side effects, got ${inspect(property)} ` +
        'defined');
    },
    deleteProperty(target, property) {
      assert.fail(`Expected no side effects, got ${inspect(property)} ` +
        'deleted');
    },
    get(target, prop, receiver) {
      return mustNotMutateObjectDeep(Reflect.get(target, prop, receiver));
    },
    preventExtensions(target) {
      assert.fail('Expected no side effects, got extensions prevented on ' +
        inspect(target));
    },
    set(target, property, value, receiver) {
      assert.fail(`Expected no side effects, got ${inspect(value)} ` +
        `assigned to ${inspect(property)}`);
    },
    setPrototypeOf(target, prototype) {
      assert.fail(`Expected no side effects, got set prototype to ${prototype}`);
    }
  };

  const proxy = new Proxy(original, _mustNotMutateObjectDeepHandler);
  _mustNotMutateObjectDeepProxies.set(original, proxy);
  return proxy;
}

export function invalidArgTypeHelper(input) {
  if (input == null) {
    return ` Received ${input}`;
  }
  if (typeof input === 'function' && input.name) {
    return ` Received function ${input.name}`;
  }
  if (typeof input === 'object') {
    if (input.constructor?.name) {
      return ` Received an instance of ${input.constructor.name}`;
    }
    return ` Received ${inspect(input, { depth: -1 })}`;
  }

  let inspected = inspect(input, { colors: false });
  if (inspected.length > 28) { inspected = `${inspected.slice(inspected, 0, 25)}...`; }

  return ` Received type ${typeof input} (${inspected})`;
}

export function skip(msg) {
  print("skip, ", msg);
}

export function platformTimeout(ms) {
  return ms;
}

export function runWithInvalidFD(func) {
  let fd = 1 << 30;
  // Get first known bad file descriptor. 1 << 30 is usually unlikely to
  // be an valid one.
  try {
    while (fs.fstatSync(fd--) && fd > 0);
  } catch {
    return func(fd);
  }

  skip('Could not generate an invalid fd');
}

export function expectWarning() {
  // unsupported
}

// Useful for testing expected internal/error objects
export function expectsError(validator, exact) {
  return mustCall((...args) => {
    if (args.length !== 1) {
      // Do not use `assert.strictEqual()` to prevent `inspect` from
      // always being called.
      assert.fail(`Expected one argument, got ${inspect(args)}`);
    }
    const error = args.pop();
    const descriptor = Object.getOwnPropertyDescriptor(error, 'message');
    // The error message should be non-enumerable
    assert.strictEqual(descriptor.enumerable, false);

    assert.throws(() => { throw error; }, validator);
    return true;
  }, exact);
}
export function canCreateSymLink() {
  return true;
}

export function getArrayBufferViews(buf) {
  const { buffer, byteOffset, byteLength } = buf;

  const out = [];

  const arrayBufferViews = [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array,
    DataView,
  ];

  for (const type of arrayBufferViews) {
    const { BYTES_PER_ELEMENT = 1 } = type;
    if (byteLength % BYTES_PER_ELEMENT === 0) {
      out.push(new type(buffer, byteOffset, byteLength / BYTES_PER_ELEMENT));
    }
  }
  return out;
}

const common = {
  isDumbTerminal,
  isFreeBSD,
  isLinux,
  isOpenBSD,
  isOSX,
  isPi,
  isSunOS,
  isWindows,
  isAIX,
  isMainThread,
  mustCall,
  mustCallAtLeast,
  mustNotCall,
  mustNotMutateObjectDeep,
  skip,
  mustSucceed,
  invalidArgTypeHelper,
  platformTimeout,
  runWithInvalidFD,
  expectWarning,
  expectsError,
  canCreateSymLink,
  getArrayBufferViews
};

export default common;
