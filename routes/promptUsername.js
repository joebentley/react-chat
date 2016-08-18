const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  res.render('prompt')
})

router.post('/', function (req, res, next) {
  req.session.username = req.body.username
  res.redirect('/')
})

module.exports = router
