const User = require('../models/User')
const { generateToken } = require('../utils/generateToken')
const { MissingFields, InvalidCredentials, UserNotFound, AuthenticatedUserNotFound } = require('../utils/HttpError')
const { sendSuccess } = require('../utils/responses')

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new MissingFields()
    }

    if (await User.findOne({ email })) {
      return res.status(400).send({
        success: false,
        message: 'Email already registered. Try to login.',
      })
    }

    const adminExists = await User.exists({ role: 'admin' })

    const user = new User({ name, email, password, role: adminExists ? 'user' : 'admin' })
    await user.save()

    const token = generateToken(user)

    return sendSuccess(res, { token }, 201)
  } catch (e) {
    return next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new MissingFields()
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      throw new InvalidCredentials()
    }

    const validPassword = await user.comparePassword(password)

    if (!validPassword) {
      throw new InvalidCredentials()
    }

    const token = generateToken(user)

    return sendSuccess(res, { token })
  } catch (e) {
    return next(e)
  }
}

const loggedUser = async (req, res, next) => {
  try {
    const { jwtUser } = req
    const user = await User.findById(jwtUser.user_id)

    if (!user) {
      throw new AuthenticatedUserNotFound()
    }

    return sendSuccess(res, { user }, 201)
  } catch (e) {
    return next(e)
  }
}

module.exports = { register, login, loggedUser }
