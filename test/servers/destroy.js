#!/usr/bin/env node

const Server = require('../../server')

const app = new Server({
  nodeId: 'server',
  subprotocol: '1.0.0',
  supports: '1.x'
})

app.auth(function () {
  return Promise.resolve(true)
})

app.unbind.push(function () {
  return new Promise(function (resolve) {
    setTimeout(function () {
      process.stderr.write(' Custom destroy task finished\n')
      resolve()
    }, 10)
  })
})

app.listen({ port: 2000 })

process.on('message', function (msg) {
  if (msg === 'close') {
    console.error('close')
    app.destroy()
  }
})
