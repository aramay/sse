var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const mongoose = require('mongoose')
const listEndPoinst = require('express-list-endpoints')
const {mesgCtrl} = require('./controllers/messageController')
const { authCtrl } = require('./controllers/authController')

mongoose.connect('mongodb://localhost:27017/Messages', {
  useNewUrlParser: true, // Boilerplate
  // If you lose connectivity, try reconnecting every 2 seconds. After 60
  // attempts, give up and emit 'reconnectFailed'.
  useUnifiedTopology: true
})
  .then((db) => console.log(`Connect to DB ${db}`))
  .catch(err => console.error(`Error connection to DB ${err}`))

var app = express()

var companies = {
  'aaa': {'subscribers': 0},
  'w3certified': {'subscribers': 0},
  'bbb': {'subscribers': 0}
}

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../views')))
app.use(express.static(path.join(__dirname, '../assets')))

// Routes
app.get('/getMessages', [mesgCtrl.getMessages])
// app.post('/postMessage', [mesgCtrl.postMessages, authCtrl.setCookie, authCtrl.sse])
app.post('/postMessage', [mesgCtrl.postMessages, mesgCtrl.sse])
app.get('/sse', [mesgCtrl.sse])
app.delete('/deleteMessage', [authCtrl.verifyCookie, mesgCtrl.deleteMessage])
// setup SSE
// app.get('/sse', (req, res) => {
//   res.set("Content-Type", "text/event-stream")
//   setInterval(() => {
//     res.status(200).write(`data: ${JSON.stringify(companies)}\n\n`)
//   }, 1000)
// })
// list all endpoints
console.log('listEndPoinst ', listEndPoinst(app))
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('no route found')
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    message: { err: 'An error occurred' }
  }
  const errorObj = Object.assign({}, defaultErr, err)
  console.log(errorObj.log)

  return res.status(500).send('Internal Server Error')
})

module.exports = app
