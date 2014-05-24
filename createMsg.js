var through = require('through2')
var map = require('through2-map')

module.exports = map.ctor({objectMode: true}, function(cmd) {
  // rfc maxlength on messages
  if (cmd.length <= 512) {
    return (cmd.prefix || '') + cmd.cmd + ' ' + cmd.params
  }
})
