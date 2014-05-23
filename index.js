module.exports = icarusBot

var net = require('net')
var through = require('through2')
var map = require('through2-map')
var reduce = require('through2-reduce')

var parseMsg = require('./createParser')
var createMsg = require('./createMsg')
var initHandler = require('./initHandler')

function icarusBot(configPath) {
  if (!configPath) {
    // HOW DO I HANDLE THIS? I ALWAYS GET SHORT CIRCUITS WRONG!
    return undefined
  }

  var config = require(configPath)
  var bot = net.connect(config.server)

  var br = map({wantStrings: true}, function(buf) {
    return(buf + '\r\n')
  })

  bot.pipe(parseMsg)
    .pipe(initHandler)
    .pipe(createMsg)
    .pipe(br)
    .pipe(bot)

  return bot
}
