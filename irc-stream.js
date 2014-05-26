module.exports = ircStream

var net = require('net')
var split = require('split')
var duplex = require('duplexer')
var parseMsg = require('./create-parser')
var createMsg = require('./create-msg')

function ircStream(server) {
  var conn = net.connect(server)
  conn.on('end', function() {
    console.log('connection terminated')
  })
  var input = parseMsg()
  var output = createMsg()

  conn.pipe(split())
    .pipe(input)

  output.pipe(conn)

  var stream = duplex(output, input)
  return stream
}

//irc->parse()
