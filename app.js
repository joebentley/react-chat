const path = require('path')
const express = require('express')
const session = require('express-session')
const logger = require('morgan')
const bodyParser = require('body-parser')

const chat = require('./routes/index')
const promptUsername = require('./routes/promptUsername')
const api = require('./routes/api')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(session({
  secret: 'changeme',
  resave: false,
  saveUninitialized: false
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static(path.join(__dirname, '/public')))

app.use('/', chat)
app.use('/promptUsername', promptUsername)
app.use('/api', api)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
