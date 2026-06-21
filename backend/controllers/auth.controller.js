const User = require('../models/User')
const { generateToken } = require('../utils/generateToken')
const { MissingFields, InvalidCredentials, UserNotFound } = require('../utils/HttpError')

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

    return res.status(200).send({
      success: true,
      token,
    })
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

    return res.status(200).send({
      success: true,
      token,
    })
  } catch (e) {
    return next(e)
  }
}

const loggedUser = async (req, res, next) => {
  try {
    const { jwtUser } = req
    const user = await User.findOne({ _id: jwtUser.user_id, email: jwtUser.email })

    if (!user) {
      throw new UserNotFound()
    }

    return res.status(200).send({
      success: true,
      user,
    })
  } catch (e) {
    return next(e)
  }
}

module.exports = { register, login, loggedUser }
