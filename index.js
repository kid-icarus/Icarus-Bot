var net = require('net')
var fs = require('fs')
var http = require('http')
var config = require('./config.json')

var irc = function() {
  console.log(config)

  var client = net.connect(config.server, function() {
    console.log('connected')
  })

  var join = function() {
    config.chans.forEach(function(chan) {
      var msg = 'JOIN ' + chan.chan
      if (chan.chanPass) {
        msg += ' ' + chan.chanPass
      }
      msg += '\r\n'
      client.write(msg)
    })
  }

  var connect = function() {
    client.write('PASS ' + config.user.pass + '\r\n')
    client.write('USER ' + config.user.user + ' 0 * :' + config.user.name + '\r\n')
    client.write('NICK ' + config.user.nick + '\r\n')
    join()
  }

  var privMsg = function(chan, msg) {
    client.write('PRIVMSG ' + chan + ' :' + msg + '\r\n')
  }

  var pong = function(server) {
    client.write('PONG ' + server + '\r\n')
  }

  var msgHandler = function(nick, msg) {
    var msg = msg.trim().split(' ')
    var chan = msg.shift()
    msg = msg.join(' ')
    if (msg.match(/^:!face/)) {
      var smiley = ''
      var req = http.get('http://smiley.meatcub.es:1337/api/v1/random', function(res) {
        if (res.statusCode === 200) {
          console.log('yay smiley')
        }
        res.on('data', function(data){
          smiley += data.toString()
        })
        res.on('end', function(){
          smileFace = JSON.parse(smiley)
          privMsg(chan, smileFace.content)
        })
      })
    }
    console.log('NICK: ' + nick)
    console.log('CHAN: ' + chan)
    console.log('MESSAGE: ' + msg)
  }

  var commandHandler = function(prefix, cmd, params) {
    if (!cmd) {
      return
    }
    switch(cmd) {
      case 'NOTICE':
        if (params.trim().indexOf('*** No Ident response') !== -1) {
          connect()
        }
        break;

      case 'PRIVMSG':
        var matches = prefix.trim().match(/:([^!]*)!.*/)
        if (matches && matches.length > 0) {
          msgHandler( matches[1], params)
        }
        console.log(matches)
        break;

      case 'PING':
        pong(params);
        break;
    }
  }

  var parseMsg = function(msg) {
    // 3 parts, prefix (optional). command, params (up to 15)
    if (!msg) {
      return
    }
    var matches = msg.match(/^(:[^ ]+)? ?(\w+)(.*)\r\n$/)
    if (!matches) {
      return
    }
    if (matches.length > 3) {
      var prefix = matches[1]
      var command = matches[2]
      var params = matches[3]
      console.log('Prefix: ' + prefix)
      console.log('Command: ' + command)
      console.log('Params: ' + params)
      commandHandler(prefix, command, params)
    }
  }


  client.on('data', function(data) {
    console.log(data.toString())
    parseMsg(data.toString())
  })
}


irc()
