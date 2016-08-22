const client = require('redis').createClient()

// Setup socket IO listeners
exports.listenSocket = function (io) {
  io.on('connection', function (socket) {
    socket.on('getUsername', function () {
      socket.emit('username', socket.handshake.session.username)
    })

    socket.on('getMessages', function () {
      client.lrange('messages', 0, -1, function (err, data) {
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
      client.get('messages:nextid', function (err, id) {
        if (err) {
          throw new Error('Could not get next ID')
        }

        // If the new ID is null, i.e. the key doesn't exist, set it to zero
        if (id === null) {
          client.set('messages:nextid', 0)
          id = '0'
        }

        let newMessage = {
          id: id,
          name: socket.handshake.session.username,
          text: message
        }

        client.rpush('messages', JSON.stringify(newMessage), function () {
          client.lrange('messages', 0, -1, function (err, data) {
            if (err) {
              throw new Error('Could not get messages')
            }

            io.sockets.emit('messages', data)
          })
        })

        client.incr('messages:nextid')
      })
    })
  })
}
