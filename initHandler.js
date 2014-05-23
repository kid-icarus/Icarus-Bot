var through = require('through2')

module.exports = through.obj(function(cmdObj, enc, cb) {
  var self = this
  if (!cmdObj.cmd) {
    return
  }
  switch(cmdObj.cmd) {
    case 'NOTICE':
      // I don't even know is this is the right way to get started lel.
      if (cmdObj.params.trim().indexOf(':*** No Ident response') !== -1) {

        this.push({
          cmd: 'PASS',
          params: config.user.pass
        })
        this.push({
          cmd: 'USER',
          params: config.user.user + ' 0 * :' + config.user.name
        })
        this.push({
          cmd: 'NICK',
          params: config.user.nick
        })

        config.chans.forEach(function(chan) {
          self.push({
            cmd: 'JOIN',
            params: chan.chan + ' ' + chan.pass
          })
        })

      }
      break;

    case '433':
      // DRY AAAAAH
      setTimeout(function() {
        self.queue({
          cmd: 'PASS',
          params: config.user.pass
        })
        self.queue({
          cmd: 'USER',
          params: config.user.user + ' 0 * :' + config.user.name
        })
        self.queue({
          cmd: 'NICK',
          params: config.user.nick
        })
      }, 15000)

      break;

    case 'PING':
      this.push({
        cmd: 'PONG',
        params: cmdObj.prefix
      })
      break;
  }
  cb()
})
