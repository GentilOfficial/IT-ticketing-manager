const User = require('../models/User')
const { UnauthorizedUser } = require('../utils/HttpError')

const authorizedUser = async (req, res, next) => {
  try {
    const { jwtUser } = req
    const user = await User.findOne({ _id: jwtUser.user_id, role: 'admin' })

    if (!user) {
      throw new UnauthorizedUser()
    }

    return next()
  } catch (e) {
    return next(e)
  }
}

module.exports = { authorizedUser }
