const User = require('../models/User')
const { sendSuccess } = require('../utils/responses')

const allUsers = async (req, res, next) => {
  try {
    const users = await User.find()

    return sendSuccess(res, { users })
  } catch (e) {
    return next(e)
  }
}

const adminUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'admin' })

    return sendSuccess(res, { users })
  } catch (e) {
    return next(e)
  }
}

module.exports = { allUsers, adminUsers }
