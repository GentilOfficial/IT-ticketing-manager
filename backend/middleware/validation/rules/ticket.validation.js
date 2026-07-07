const { body } = require('express-validator')
const { validateRequest } = require('../validation.middleware')

const validateTicketCreate = [
  body('title').trim().isLength({ min: 5, max: 120 }).withMessage('Title must be between 5 and 120 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 4000 })
    .withMessage('Description must be between 10 and 4000 characters'),
  body('createdBy').optional().isMongoId().withMessage('Invalid target user id'),
  validateRequest,
]

const validateTicketUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 120 })
    .withMessage('Title must be between 5 and 120 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 4000 })
    .withMessage('Description must be between 10 and 4000 characters'),
  body('status').optional().isIn(['open', 'in_progress', 'resolved', 'on_hold']).withMessage('Invalid status'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid assigned user id'),
  validateRequest,
]

module.exports = { validateTicketCreate, validateTicketUpdate }
