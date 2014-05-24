module.exports = icarusBot

var net = require('net')
var through = require('through2')
var map = require('through2-map')
var reduce = require('through2-reduce')

var parseMsg = require('./createParser')
var createMsg = require('./createMsg')

function icarusBot(configPath) {
  var config = require(configPath)
  var initHandler = require('./initHandler')(config)

  if (!configPath) {
    // HOW DO I HANDLE THIS? I ALWAYS GET SHORT CIRCUITS WRONG!
    return undefined
  }

  var bot = net.connect(config.server)

  var br = map.ctor({wantStrings: true}, function(buf) {
    return(buf + '\r\n')
  })

  bot.pipe(parseMsg())
    .pipe(initHandler)
    .pipe(createMsg())
    .pipe(br())
    .pipe(bot)

  return bot
}
