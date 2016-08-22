
// Setup socket IO listeners
exports.listenSocket = function (io, redisClient) {
  io.on('connection', function (socket) {
    socket.on('getUsername', function () {
      socket.emit('username', socket.handshake.session.username)
    })

    socket.on('getMessages', function () {
      redisClient.lrange('messages', 0, -1, function (err, data) {
        if (err) {
          throw new Error('Could not get messages')
        }

        if (data === null) {
          data = []
        }
        io.sockets.emit('messages', data)
      })
    })

    socket.on('newMessage', function (message) {
      redisClient.get('messages:nextid', function (err, id) {
        if (err) {
          throw new Error('Could not get next ID')
        }

        // If the new ID is null, i.e. the key doesn't exist, set it to zero
        if (id === null) {
          redisClient.set('messages:nextid', 0)
          id = '0'
        }

        let newMessage = {
          id: id,
          name: socket.handshake.session.username,
          text: message
        }

        redisClient.rpush('messages', JSON.stringify(newMessage), function () {
          redisClient.lrange('messages', 0, -1, function (err, data) {
            if (err) {
              throw new Error('Could not get messages')
            }

            io.sockets.emit('messages', data)
          })
        })

        redisClient.incr('messages:nextid')
      })
    })
  })
}
