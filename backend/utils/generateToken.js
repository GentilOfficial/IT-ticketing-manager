const { sign } = require('jsonwebtoken')

const generateToken = (user) => {
  return sign(
    {
      user_id: user._id,
      email: user.email,
    },
    process.env.JWT_SIGN_SECRET,
    { expiresIn: process.env.JWT_DURATION },
  )
}

module.exports = { generateToken }
