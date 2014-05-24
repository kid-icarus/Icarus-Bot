var through = require('through2')
var map = require('through2-map')

module.exports =  map.ctor({wantStrings: true, objectMode: true}, function(msg){
  // 3 parts, prefix (optional). command, params (up to 15)

  if (!msg) {
    return
  }

  var matches = msg.match(/^(:[^ ]+)? ?(\w+)(.*)\r\n$/)
  if (!matches) {
    return
  }

  return {
    prefix: matches[1],
    cmd: matches[2],
    params: matches[3]
  }
})
