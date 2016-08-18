const express = require('express')
const router = express.Router()

router.get('/messages', function (req, res, next) {
  let data = [ { id: 1, name: 'joe', text: 'hello marie!' },
               { id: 2, name: 'marie', text: 'hey joe' } ]

  res.send(data)
})

module.exports = router
