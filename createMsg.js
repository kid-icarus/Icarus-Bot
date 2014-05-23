var through = require('through2')
var map = require('through2-map')

module.exports = map({objectMode: true}, function(cmd) {
  console.log(cmd)
  // rfc maxlength on messages
  if (cmd.length <= 512) {
    console.log((cmd.prefix || '') + cmd.cmd + ' ' + cmd.params)
    return (cmd.prefix || '') + cmd.cmd + ' ' + cmd.params
  }
})
