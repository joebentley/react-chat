
// Setup socket IO listeners
exports.listenSocket = function (io, redisClient) {
  io.on('connection', function (socket) {
    let username = socket.handshake.session.username

    redisClient.hget('users', username, function (err, user) {
      if (err) {
        throw new Error('Could not get messages')
      }

      if (user !== null) {
        user = JSON.parse(user)
        socket.join(user.channel)
      }
    })

    socket.on('getUsername', function () {
      socket.emit('username', username)
    })

    socket.on('getMessages', function () {
      redisClient.lrange('messages', 0, -1, function (err, data) {
        if (err) {
          throw new Error('Could not get messages')
        }

        if (data === null) {
          data = []
        }

        redisClient.hmget('users', username, function (err, user) {
          if (err) {
            throw new Error('Could not get users')
          }

          if (user !== null) {
            user = JSON.parse(user)

            io.to(user.channel).emit('messages', data.filter((message) => {
              message = JSON.parse(message)
              return message.channel === user.channel
            }))
          }
        })
      })
    })

    socket.on('newMessage', function (message) {
      redisClient.hget('users', username, function (err, user) {
        if (err) {
          throw new Error('Could not get users')
        }

        if (user !== null) {
          user = JSON.parse(user)

          redisClient.llen('messages', function (err, length) {
            if (err) {
              throw new Error('Could not get length of list')
            }

            let newMessage = {
              id: length,
              name: username,
              text: message,
              channel: user.channel
            }

            redisClient.rpush('messages', JSON.stringify(newMessage), function () {
              redisClient.lrange('messages', 0, -1, function (err, data) {
                if (err) {
                  throw new Error('Could not get messages')
                }

                io.to(user.channel).emit('messages', data.filter((message) => {
                  return message.channel === user.channel
                }))
              })
            })
          })
        }
      })
    })

    socket.on('getChannels', function () {
      let channels = ['#general', '#random', '#images']

      socket.emit('channels', channels)
    })

    socket.on('switchChannel', function (newChannel) {
      redisClient.hget('users', username, function (err, user) {
        if (err) {
          throw new Error('Could not get users')
        }

        if (user !== null) {
          user = JSON.parse(user)

          user.channel = newChannel
          redisClient.hmset('users', username, JSON.stringify(user))

          socket.emit('channelSwitched')
        }
      })
    })
  })
}
