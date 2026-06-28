const { Schema, model } = require('mongoose')
const autopopulatePlugin = require('mongoose-autopopulate')

const commentSchema = new Schema(
  {
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'ticket',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      autopopulate: true,
    },
    message: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 400,
      trim: true,
    },
  },
  { timestamps: true, strict: true },
)

commentSchema.plugin(autopopulatePlugin)

module.exports = model('comment', commentSchema, 'comments')
