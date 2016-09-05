const Message = require('../models/message.js')
const User = require('../models/user.js')


// Setup socket IO listeners
exports.listenSocket = function (io, redisClient) {
  io.on('connection', function (socket) {
    let username = socket.handshake.session.username

    let users = User(redisClient)
    let messages = Message(redisClient)

    // If user has a username, look up their room from redis and join their socket to that room
    if (username !== undefined) {
      users.attachSocket(username, socket, function (err) {
        if (err) {
          throw err
        }
      })
    }

    socket.on('getUser', function () {
      users.getUser(username, function (err, user) {
        if (err) {
          throw err
        }
        socket.emit('user', user)
      })
    })

    socket.on('getMessages', function () {
      messages.getMessages(username, function (err, messages) {
        if (err) {
          throw err
        }
        socket.emit('messages', messages)
      })
    })

    socket.on('newMessage', function (message) {
      messages.newMessage(username, message, function (err, messages) {
        if (err) {
          throw err
        }

        users.getUser(username, function (err, user) {
          if (err) {
            throw err
          }

          // Broadcast to all users on current user's channel
          io.to(user.channel).emit('messages', messages)
        })
      })
    })

    socket.on('getChannels', function () {
      // TODO: Move these into redis, and allow user to create new rooms
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

          // Switch socket room
          socket.leave(user.channel)
          socket.join(newChannel)

          // Push user with new channel to redis
          user.channel = newChannel
          redisClient.hmset('users', username, JSON.stringify(user))

          socket.emit('channelSwitched')
        }
      })
    })
  })
}
