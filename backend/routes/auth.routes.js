const express = require('express')
const authRoutes = express.Router()

authRoutes.post('/register', (req, res, next) => {
  res.status(200).send({ route: 'register' })
})
authRoutes.post('/login', (req, res, next) => {
  res.status(200).send({ route: 'login' })
})
authRoutes.get('/me', (req, res, next) => {
  res.status(200).send({ route: 'me' })
})

module.exports = { authRoutes }
