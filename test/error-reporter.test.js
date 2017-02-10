const errorReporter = require('../error-reporter')
const reporter = require('../reporter')

function errorHelperOut () {
  return errorReporter.apply({}, arguments).replace(/\r\v/g, '\n')
}

const BaseServer = require('../base-server')

const app = new BaseServer({
  env: 'development',
  pid: 21384,
  nodeId: 'server:H1f8LAyzl',
  subprotocol: '2.5.0',
  supports: '2.x || 1.x'
})
app.listenOptions = { host: '127.0.0.1', port: 1337 }

const originNow = reporter.now
beforeAll(function () {
  reporter.now = function () {
    return new Date((new Date()).getTimezoneOffset() * 60000)
  }
})
afterAll(function () {
  reporter.now = originNow
})

it('handles EACCESS error', function () {
  expect(errorHelperOut({code: 'EACCES'}, app)).toMatchSnapshot()
})

it('handles error in production', function () {
  const http = new BaseServer({
    env: 'production',
    pid: 21384,
    nodeId: 'server:H1f8LAyzl',
    subprotocol: '2.5.0',
    supports: '2.x || 1.x'
  })
  http.listenOptions = { host: '127.0.0.1', port: 1000 }

  expect(errorHelperOut({code: 'EACCES', port: 1000}, http)).toMatchSnapshot()
})

it('handles EADDRINUSE error', function () {
  expect(errorHelperOut({
    code: 'EADDRINUSE',
    port: 1337
  }, app)).toMatchSnapshot()
})

it('throws on undefined error', function () {
  const e = {
    code: 'EAGAIN',
    message: 'resource temporarily unavailable'
  }
  function errorHelperThrow () {
    errorHelperOut(e, app)
  }
  expect(errorHelperThrow).toThrowError(/resource temporarily unavailable/)
})
