import { hello as module_def_hello } from './module_def.js'

module_def_hello()

async function f() {
  const { hello, something } = await import('./module_def_async.js')
  await hello()
  console.log('./module_def_async.js `something` is ', something)
}

f()
