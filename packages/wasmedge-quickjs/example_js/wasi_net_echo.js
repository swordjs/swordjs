import { TextDecoder } from 'node:util'
import { exit, nextTick } from 'node:process'
import * as net from 'wasi_net'

async function handle_client(cs) {
  print('server accept:', cs.peer())
  try {
    while (true) {
      const d = await cs.read()
      if (d == undefined || d.byteLength <= 0)
        break

      const s = new TextDecoder().decode(d)
      print('server recv:', s)
      cs.write(`echo:${s}`)
    }
  }
  catch (e) {
    print('server handle_client error:', e)
  }
  print('server: conn close')
}

async function server_start() {
  print('listen 8000 ...')
  try {
    const s = new net.WasiTcpServer(8000)
    for (let i = 0; i < 100; i++) {
      const cs = await s.accept()
      handle_client(cs)
    }
  }
  catch (e) {
    print('server accept error:', e)
  }
}

server_start()

async function connect_test() {
  try {
    const ss = await net.WasiTcpConn.connect('127.0.0.1:8000')
    ss.write('hello')
    const msg = await ss.read() || ''
    print('client recv:', new TextDecoder().decode(msg))
  }
  catch (e) {
    print('client catch:', e)
  }
  finally {
    nextTick(() => {
      exit(0)
    })
  }
}

connect_test()
