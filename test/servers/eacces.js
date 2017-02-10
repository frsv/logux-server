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

app.listen({ port: 1000 })
