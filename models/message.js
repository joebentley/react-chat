const User = require('../models/user')

module.exports = function (redisClient) {
  const users = User(redisClient)

  return {
    getMessages: function (username, callback) {
      redisClient.lrange('messages', 0, -1, function (err, data) {
        if (err) {
          callback(err)
        }

        if (data === null) {
          data = []
        }

        users.getUser(username, function (err, user) {
          if (err) {
            callback(err)
          }

          callback(null, data.map(JSON.parse).filter((message) => {
            return message.channel === user.channel
          }))
        })
      })
    },

    newMessage: function (username, message, callback) {
      users.getUser(username, function (err, user) {
        if (err) {
          callback(err)
        }

        // Get current number of messages for ID
        redisClient.llen('messages', function (err, length) {
          if (err) {
            callback(err)
          }

          let newMessage = {
            id: length,
            name: username,
            message: message,
            channel: user.channel
          }

          // Push new message onto list
          redisClient.rpush('messages', JSON.stringify(newMessage), function () {
            redisClient.lrange('messages', 0, -1, function (err, data) {
              if (err) {
                callback(err)
              }

              // Return all messages that are in the user's channel
              callback(null, data.map(JSON.parse).filter((message) => {
                return message.channel === user.channel
              }))
            })
          })
        })
      })
    }
  }
}
