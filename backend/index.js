const express = require('express')
const cors = require('cors')
const { initServer } = require('./config/server')
require('dotenv').config()

const { requestLogger } = require('./middleware/logger.middleware')
const { protectRoutes } = require('./middleware/protect.middleware')
const { errorHandler } = require('./middleware/error.middleware')

const { router } = require('./routes/index.routes')

const SERVER_PORT = process.env.PORT
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING

const server = express()

server.use(express.json())
server.use(cors())

server.use(requestLogger)
server.use(protectRoutes)
server.use('/api', router)
server.use(errorHandler)

initServer(server, SERVER_PORT, MONGODB_CONNECTION_STRING)
