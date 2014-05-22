module.exports = icarusbot

var net = require('net')
var through = require('through')

function icarusbot(configPath) {
  if (!configPath) {
    // HOW DO I HANDLE THIS? I ALWAYS GET SHORT CIRCUITS WRONG!
    return undefined
  }

  var config = require(configPath)
  console.log(config)
  var bot = net.connect(config.server)

  //convert rfc to object
  // HOW DO I SHARE THIS WITH OTHER MODULES?
  var parseMsg =  through(function(buf){
    // 3 parts, prefix (optional). command, params (up to 15)

    var msg = buf.toString()
    if (!msg) {
      return
    }

    // Todo: uh... the optional first capture needs to be dealt with?
    var matches = msg.match(/^(:[^ ]+)? ?(\w+)(.*)\r\n$/)
    if (!matches) {
      return
    }

    this.queue(JSON.stringify({
      prefix: matches[1],
      cmd: matches[2],
      params: matches[3]
    }))
  })

  // Core commands that should be handled to intialize and keep the bot alive.
  var initHandler = through(function(cmd) {
    var self = this
    cmdObj = JSON.parse(cmd)
    if (!cmdObj.cmd) {
      return
    }
    switch(cmdObj.cmd) {
      case 'NOTICE':
        // I don't even know is this is the right way to get started lel.
        if (cmdObj.params.trim().indexOf('*** No Ident response') !== -1) {
          this.queue('PASS ' + config.user.pass)
          this.queue('USER ' + config.user.user + ' 0 * :' + config.user.name)
          this.queue('NICK ' + config.user.nick)

          config.chans.forEach(function(chan) {
            self.queue('JOIN ' + chan.chan + ' ' + chan.pass)
          })

        }
        break;

      case '433':
        // DRY AAAAAH
        setTimeout(function() {
          self.queue('PASS ' + config.user.pass)
          self.queue('USER ' + config.user.user + ' 0 * :' + config.user.name)
          self.queue('NICK ' + config.user.nick)
        }, 15000)

        break;

      case 'PING':
        this.queue('PONG ' + cmdObj.prefix)
        break;
    }
  })

  var br = through(function(buf) {
    this.queue(buf + '\r\n')
  })

  // TODO: finish dis, use it in da pipe.
  var generateCmd = through(function(cmd) {
    cmdObj = JSON.parse(cmd)
    this.queue()
  })

  //{} to rfc chats to send out.
  var validate = through(function(cmd) {
    if (cmd.length <= 512) {
      this.queue(cmd)
    }
  })


  bot.pipe(bot.prototype.parseMsg)
    .pipe(initHandler)
    .pipe(br)
    .pipe(validate)
    .pipe(bot)

  return bot
}

