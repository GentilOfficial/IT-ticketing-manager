const { Schema, model } = require('mongoose')
const { hash, compare } = require('bcrypt')
const {
  UnauthorizedFieldEdit,
  EmailAlreadyRegistered,
  InvalidGoogleProfile,
  UnverifiedGoogleEmail,
} = require('../utils/HttpError')

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 60,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.isLocal()
      },
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    oauth: {
      provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
      },
      id: {
        type: String,
        select: false,
      },
    },
  },
  { timestamps: true, strict: true },
)

userSchema.index({ 'oauth.id': 1 }, { unique: true, sparse: true })

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return
  this.password = await hash(this.password, 12)
})

userSchema.methods.comparePassword = function (password) {
  return compare(password, this.password)
}

userSchema.methods.isAdmin = function () {
  return this.role === 'admin'
}

userSchema.methods.changeRole = function (newRole, editor) {
  if (this.role === newRole) {
    return this
  }

  if (!editor.isAdmin() || this.id === editor.id) throw new UnauthorizedFieldEdit('role')

  this.role = newRole

  return this
}

userSchema.methods.isLocal = function () {
  return this.oauth.provider === 'local'
}

userSchema.statics.findOrCreateFromGoogle = async function (profile) {
  if (!profile || !profile.id) {
    throw new InvalidGoogleProfile()
  }

  const existingOAuthUser = await this.findOne({
    'oauth.provider': 'google',
    'oauth.id': profile.id,
  })

  if (existingOAuthUser) {
    return existingOAuthUser
  }

  const profileEmail = profile.emails ? profile.emails[0] : null
  const email = profileEmail ? profileEmail.value : null

  if (!email || profileEmail.verified !== true) {
    throw new UnverifiedGoogleEmail()
  }

  const existingUserByEmail = await this.findOne({ email })

  if (existingUserByEmail && existingUserByEmail.isLocal()) {
    throw new EmailAlreadyRegistered()
  }

  if (existingUserByEmail) {
    return existingUserByEmail
  }

  const adminExists = await this.exists({ role: 'admin' })

  return this.create({
    name: profile.displayName || email.split('@')[0],
    email,
    role: adminExists ? 'user' : 'admin',
    oauth: {
      provider: 'google',
      id: profile.id,
    },
  })
}

module.exports = model('user', userSchema, 'users')
