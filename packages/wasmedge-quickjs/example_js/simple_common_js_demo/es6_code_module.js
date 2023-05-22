import * as std from 'std'

export function run() {
  print('write file')
  const f = std.open('hello.txt', 'w')
  const x = f.puts('hello wasm')
  f.flush()
  f.close()
}
