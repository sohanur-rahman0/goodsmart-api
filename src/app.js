const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const compression = require('compression')
const cors = require('cors')
const httpStatus = require('http-status')
const dotenv = require('dotenv').config()
const { authLimiter } = require('./middlewares/rateLimiter')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./utils/errorHandler')
const routes = require('./routes/v1')

process.on('uncaughtException', (err) => {
  console.log(err)
  console.log('Uncaught Exception! Shutting down the server!')
  process.exit(1)
})

const app = express()
app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// sanitize request data
app.use(xss())
app.use(mongoSanitize())

// gzip compression
app.use(compression())

// enable cors
app.use(cors())
app.options('*', cors())

// limit repeated failed requests to auth endpoints
if (process.env.NODE_ENV === 'production') {
  app.use('/v1/auth', authLimiter)
}

// v1 api routes
app.use('/v1', routes)

process.on('warning', (e) => console.warn(e.stack))

app.all('*', (req, res, next) => {
  console.log('hit')
  next(new AppError(`Can't find this url: ${req.originalUrl}`, 404))
})

app.use(globalErrorHandler)

process.on('unhandledRejection', (err) => {
  console.log(err)
  console.log('Unhandled Rejection! Shutting down the server!')
  server.close(() => {
    process.exit(1)
  })
})

module.exports = app
