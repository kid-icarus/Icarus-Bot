var config = require('./config')
var stream = require('./irc-stream')(config.server)
var through = require('through2')
var events = require('events')
var bot = new events.EventEmitter()
var coreHandlers = require('./coreHandlers')(bot)

var msg = function(targets, message) {
  bot.emit('cmd', {
    cmd: 'privmsg',
    params: [targets.join(' '), ':' + message].join(' ')
  })
}

bot.on('cmd', function(cmd){
  stream.write(cmd)
})

var botEmitter = through.obj(function(cmdObj, enc, cb) {
  bot.emit(cmdObj.cmd.toLowerCase(), cmdObj)
  cb()
})

stream.pipe(botEmitter)

module.exports = bot
module.exports.msg = msg
