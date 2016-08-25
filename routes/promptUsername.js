const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  res.render('prompt', { error: '' })
})

router.post('/', function (req, res, next) {
  if (req.body.username.match(/\S/g) === null) {
    res.render('prompt', { error: 'Error: username cannot be empty' })
    next()
  }

  req.session.username = req.body.username

  // Add user to redis
  let redisClient = req.app.get('redisClient')
  let newUser = { username: req.body.username, channel: '#general' }

  redisClient.hset('users', newUser.username, JSON.stringify(newUser))

  res.redirect('/')
})

module.exports = router
