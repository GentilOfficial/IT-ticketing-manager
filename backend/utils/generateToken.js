const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.id,
    },
    process.env.JWT_SIGN_SECRET,
    { expiresIn: process.env.JWT_DURATION },
  )
}

module.exports = { generateToken }
