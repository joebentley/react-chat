const express = require('express')
const router = express.Router()

router.get(['/', '/chat'], function (req, res) {
  if (req.session.username === undefined) {
    res.redirect('promptUsername')
  } else {
    res.render('index', {username: req.session.username})
  }
})

module.exports = router
