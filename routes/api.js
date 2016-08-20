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
    res.redirect('promptUsername')
  }

  let message = { id: data.length, name: req.session.username, text: req.body.message }

  data.push(message)

  res.send(message)
})

module.exports = router
