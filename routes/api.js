
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
      redisClient.llen('messages', function (err, length) {
        if (err) {
          throw new Error('Could not get length of list')
        }

        let newMessage = {
          id: length,
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
      })
    })

    socket.on('getChannels', function () {
      let channels = ['#general', '#random', '#images']

      socket.emit('channels', channels)
    })
  })
}
