const path = require('path')
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const sharedSession = require('express-socket.io-session')

const chat = require('./routes/index')
const promptUsername = require('./routes/promptUsername')
const api = require('./routes/api')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const redisClient = require('redis').createClient(process.env.REDIS_URL)

const expressSession = require('express-session')
const RedisStore = require('connect-redis')(expressSession)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Setup session middleware
const session = expressSession({
  store: new RedisStore({
    client: redisClient
  }),
  secret: 'changeme',
  resave: false,
  saveUninitialized: false
})
app.use(session)

app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static(path.join(__dirname, '/public')))

// Setup session for socket IO
io.use(sharedSession(session, {
  autoSave: true
}))

// Add reference to socket and redis to app
app.set('socketIO', io)
app.set('redisClient', redisClient)

app.use('/', chat)
app.use('/promptUsername', promptUsername)

// Setup socket IO API listeners
api.listenSocket(io, redisClient)

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

module.exports = { app, server }
