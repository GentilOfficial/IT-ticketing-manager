const { Schema, model } = require('mongoose')
const { hash, compare } = require('bcrypt')
const { UnauthorizedFieldEdit } = require('../utils/HttpError')

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
      required: true,
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

module.exports = model('user', userSchema, 'users')
