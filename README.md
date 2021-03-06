##ICARUS BOT
![Icarus](http://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/%27The_Fall_of_Icarus%27%2C_17th_century%2C_Mus%C3%A9e_Antoine_Vivenel.JPG/640px-%27The_Fall_of_Icarus%27%2C_17th_century%2C_Mus%C3%A9e_Antoine_Vivenel.JPG)

This is a very simple IRC bot that I built from scratch because I wanted to
learn about [RFC 2813](http://tools.ietf.org/html/rfc2813)

##Creating a bot:
 - `npm install icarusbot`
 - npm install any plugins you want.
 - Copy node_modules/icarusbot/config.dist.json to node_modules/icarusbot/config.json TODO: Fix that, updates break config.
 - Fill out all the stuff in config.json
 - Write a bot consumer:

    ```javascript
    var bot = require('icarusbot')
    var pluginFoo = require('icarubot-plugin-foo')(bot)
    var pluginBar = require('icarubot-plugin-bar')(bot)
    ```
 - Run your bot
   `node whatever-you-name-your-bot.js`


##Creating a plugin:
The bot currently emits various events that you can listen to, most notably the
`msg` event.


Here is a simple plugin:
```javascript
module.exports = function(bot) {
  bot.on('msg',function(msg) {
    console.log(msg) // {sender: 'a_nick', chan: '##foo', msg: 'foo bar baz'}

    // bot.msg() supports writing messages in a sane way.
    if (msg.msg === 'wow') {
      bot.msg(['#channel1', '#channel2'], 'mom')
    }
  })
}
```

#Current plugins (PR to add yours!):
 - [icarusbot-lysergix](https://github.com/kid-icarus/icarusbot-lysergix):
   - Adds a handler for a !face message that posts a random face from [lysergix-api](http://smiley.meatcub.es:1337/api/v1/faces)

 - [icarusbot-reddit](https://github.com/kid-icarus/icarusbot-reddit):
  - Adds a !r command that accepts a subreddit and optionally an nth latest
    post and returns the title and link of the post.

 - [icarusbot-twitter](https://github.com/kid-icarus/icarusbot-twitter):
  - Adds !tw command with various subcommands to interact with twitter.

 - [icarusbot-coinflip](https://github.com/void--/icarusbot-coinflip):
  - Adds a !flip command for when you just can't make up your mind.
