const express = require('express')
const router = express.Router()

const User = require('../models/user')

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
  const redisClient = req.app.get('redisClient')
  const userModel = User(redisClient)
  const newUser = { username: req.body.username, channel: '#general' }

  userModel.newUser(newUser, function (err) {
    if (err) {
      next(err)
    }

    res.redirect('/')
  })
})

module.exports = router
