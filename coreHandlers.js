var config = require('./config')

module.exports = function(bot) {
  bot.on('privmsg', function(cmd){
    var params = cmd.params.trim().split(' ')
    var message = {
      sender: cmd.prefix.match(/^:([^!]*)!/)[1],
      chan: params.shift(),
      msg: params.join(' ').match(/^:(.*)/)[1]
    }
    bot.emit('msg', message)
  })

  bot.on('ping', function(cmd) {
    bot.emit('cmd', {
      cmd: 'PONG',
      params: cmd.prefix
    })
  })

  bot.on('notice', function(cmd){
    if (cmd.params.trim().indexOf(':*** No Ident response') !== -1) {
      bot.emit('cmd', {
        cmd: 'PASS',
        params: config.user.pass
      })
      bot.emit('cmd',{
        cmd: 'USER',
        params: config.user.user + ' 0 * :' + config.user.name
      })
      bot.emit('cmd',{
        cmd: 'NICK',
        params: config.user.nick
      })
      config.chans.forEach(function(chan) {
        bot.emit('cmd', {
          cmd: 'JOIN',
          params: chan.chan + ' ' + chan.pass
        })
      })
    }
  })
}
