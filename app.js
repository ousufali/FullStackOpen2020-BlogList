require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/user')


logger.info('Connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('connected to mongoDb'))
    .catch((error) => logger.error("mongodb connection failed"))

app.use(cors())
app.use(express.json())


app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)


app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)


module.exports = app 