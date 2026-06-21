const { Schema, model } = require('mongoose')

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

module.exports = model('ticket', ticketSchema, 'tickets')
