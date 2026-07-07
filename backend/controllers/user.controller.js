const User = require('../models/User')
const { userRoutes } = require('../routes/user.routes')
const { sendSuccess } = require('../utils/responses')
const { normalizeRegex, getPositiveInteger } = require('../utils/pagination')

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
    const { search } = req.query

    const requestedPage = getPositiveInteger(req.query.page, 1)
    const limit = Math.min(100, getPositiveInteger(req.query.limit, 20))

    const filters = search
      ? {
          $or: [
            { name: { $regex: normalizeRegex(search), $options: 'i' } },
            { email: { $regex: normalizeRegex(search), $options: 'i' } },
          ],
        }
      : {}

    const totalUsers = await User.countDocuments(filters)
    const totalPages = Math.max(1, Math.ceil(totalUsers / limit))
    const page = Math.min(requestedPage, totalPages)
    const skip = (page - 1) * limit

    const users = await User.find(filters).sort({ name: 1 }).skip(skip).limit(limit)

    return sendSuccess(res, {
      users,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
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
