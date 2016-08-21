const express = require('express')
const router = express.Router()


let data = [ { id: 0, name: 'joe', text: 'hello marie!' },
             { id: 1, name: 'marie', text: 'hey joe' } ]

router.get('/messages', function (req, res, next) {
  res.send(data)
})

router.post('/messages', function (req, res, next) {
  // Redirect to username page if they don't have a session
  if (req.session.username === undefined) {
    res.redirect('/promptUsername')
  }

  let message = { id: data.length, name: req.session.username, text: req.body.message }

  data.push(message)

  res.send(message)
})

router.get('/username', function (req, res, next) {
  // Redirect to username page if they don't have a session
  if (req.session.username === undefined) {
    res.redirect('/promptUsername')
  }

  res.send({ username: req.session.username })
})

exports.router = router

// Setup socket IO listeners
exports.listenSocket = function (io) {
  io.on('connection', function (socket) {
    socket.on('getUsername', function () {
      socket.emit('username', socket.handshake.session.username)
    })

    socket.on('getMessages', function () {
      socket.emit('messages', data)
    })

    socket.on('newMessage', function (message) {
      let newMessage = {
        id: data.length,
        name: socket.handshake.session.username,
        text: message
      }
      data.push(newMessage)

      console.log(data)

      socket.emit('messages', data)
    })
  })
}
