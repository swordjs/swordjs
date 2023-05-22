import * as process from 'node:process'

args = args.slice(1)
print('Hello', ...args)
setTimeout(() => {
  print('timeout 2s')
}, 2000)

const env = process.env
for (const k in env)
  print(k, '=', env[k])
