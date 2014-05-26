var through = require('through2')
var map = require('through2-map')

module.exports =  map.ctor({wantStrings: true, objectMode: true}, function(msg){
  if (!msg) {
    return
  }

  var matches = msg.match(/^(:[^ ]+)? ?(\w+)(.*)$/)
  if (!matches) {
    return {}
  }
  return {
    prefix: matches[1],
    cmd: matches[2],
    params: matches[3]
  }
})
