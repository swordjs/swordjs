import { TextDecoder } from 'node:util'
import * as net from 'wasi_net'

async function handle_client(cs) {
  print(cs.peer())
  const timeout_millis = 5000
  while (true) {
    try {
      const d = await cs.read(timeout_millis)
      if (d.byteLength <= 0)
        break

      const s = new TextDecoder().decode(d)
      print('recv:', s)
      cs.write(`echo:${s}`)
    }
    catch (e) {
      print('handle_client err:', e)
      break
    }
  }
  print('close')
}

async function server_start() {
  print('listen 8000 ...')
  const s = new net.WasiTcpServer(8000)
  const timeout_millis = 5000
  for (let i = 0; i < 10; i++) {
    try {
      const cs = await s.accept(timeout_millis)
      handle_client(cs)
    }
    catch (e) {
      print('accept err:', e)
    }
  }
}

server_start()
