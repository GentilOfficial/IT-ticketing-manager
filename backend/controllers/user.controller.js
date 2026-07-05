const User = require('../models/User')
const { userRoutes } = require('../routes/user.routes')
const { sendSuccess } = require('../utils/responses')

const loggedUser = async (req, res, next) => {
  try {
    const { user } = req

    return sendSuccess(res, { user })
  } catch (e) {
    return next(e)
  }
}

const allUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ name: 1 })

    return sendSuccess(res, { users })
  } catch (e) {
    return next(e)
  }
}

const adminUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'admin' }).sort({ name: 1 })

    return sendSuccess(res, { users })
  } catch (e) {
    return next(e)
  }
}

const editUser = async (req, res, next) => {
  try {
    const { user, accessedUser, body } = req
    const { name, role } = body

    if (name) accessedUser.name = name
    if (role) accessedUser.changeRole(role, user)

    await accessedUser.save()

    return sendSuccess(res, { user: accessedUser })
  } catch (e) {
    return next(e)
  }
}

module.exports = { loggedUser, allUsers, adminUsers, editUser }
