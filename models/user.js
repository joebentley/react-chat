
module.exports = function (redisClient) {
  return {
    attachSocket: function (username, socket, callback) {
      redisClient.hget('users', username, function (err, user) {
        if (err) {
          callback(err)
        }

        if (user !== null) {
          user = JSON.parse(user)
          socket.join(user.channel)
        }

        callback()
      })
    },

    getUser: function (username, callback) {
      redisClient.hmget('users', username, function (err, user) {
        if (err) {
          callback(err)
        }

        if (user !== null) {
          user = JSON.parse(user)
          callback(null, user)
        }
      })
    },

    newUser: function (newUser, callback) {
      redisClient.hset('users', newUser.username, JSON.stringify(newUser), callback)
    }
  }
}
