const express = require('express')
const cors = require('cors')
const initServer = require('./config/server')
require('dotenv').config()

const SERVER_PORT = process.env.PORT
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING

const server = express()

server.use(express.json())
server.use(cors())

initServer(server, SERVER_PORT, MONGODB_CONNECTION_STRING)
