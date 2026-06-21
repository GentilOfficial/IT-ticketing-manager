const { Schema, model } = require('mongoose')
const { InvalidTicketStatusTransition } = require('../utils/HttpError')

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 120,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 4000,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'on_hold'],
      default: 'open',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, strict: true },
)

ticketSchema.pre('save', function () {
  if (!this.isModified('status')) return
  this.resolvedAt = this.status === 'resolved' ? new Date() : null
})

ticketSchema.methods.changeStatus = async function (newStatus) {
  if (this.status === newStatus) {
    return this
  }

  const ALLOWED_TRANSITIONS = {
    open: ['in_progress', 'on_hold'],
    in_progress: ['resolved', 'on_hold', 'open'],
    on_hold: ['in_progress', 'open'],
    resolved: ['open'],
  }

  const allowed = ALLOWED_TRANSITIONS[this.status] ?? []

  if (!allowed.includes(newStatus)) {
    throw new InvalidTicketStatusTransition(this.status, newStatus)
  }

  this.status = newStatus

  await this.save()

  return this
}

module.exports = model('ticket', ticketSchema, 'tickets')
