const express = require('express')
const cors = require('cors')
const { initServer } = require('./config/server')
const { initSessionCookies } = require('./config/session')
const { initDocumentation } = require('./config/scalar')
require('dotenv').config()
const { passport } = require('./config/passport')

const { requestLogger } = require('./middleware/logger.middleware')
const { protectRoutes } = require('./middleware/protect.middleware')
const { errorHandler } = require('./middleware/error.middleware')

const { router } = require('./routes/index.routes')

const server = express()

server.use(express.json())

server.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  }),
)

initSessionCookies(server)
server.use(passport.initialize())
initDocumentation(server)

server.use(requestLogger)
server.use(protectRoutes)
server.use('/api', router)
server.use(errorHandler)

initServer(server, process.env.PORT, process.env.MONGODB_CONNECTION_STRING)
