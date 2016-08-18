const path = require('path')
const express = require('express')
const session = require('express-session')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(session({
  secret: 'changeme',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))

app.get('/', function (req, res) {
  if (req.session.username === undefined) {
    res.redirect('promptUsername')
  } else {
    res.render('index')
  }

  // var sess = req.session
  // if (sess.views) {
  //   sess.views++
  //   res.setHeader('Content-Type', 'text/html')
  //   res.write('<p>views: ' + sess.views + '</p>')
  //   res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
  //   res.end()
  // } else {
  //   sess.views = 1
  //   res.end('welcome to the session demo. refresh!')
  // }
})

app.get('/promptUsername', function (req, res, next) {
  res.render('prompt')
})

app.use('/static', express.static(path.join(__dirname, '/public')))

app.listen(8080, function () {
  console.log('listening on port 8080')
})
