module.exports = icarusBot

var net = require('net')
var duplex = require('duplexer')

var parseMsg = require('./createParser')
var createMsg = require('./createMsg')

function icarusBot(configPath) {
  console.log('hi')
  var config = require(configPath)
  var initHandler = require('./initHandler')(config)

  var conn = net.connect(config.server)
  var input = parseMsg()
  var output = createMsg()

  conn.pipe(input)
  output.pipe(conn)

  var stream = duplex(input, output)
  return stream
}
