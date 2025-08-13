const { body } = require('express-validator');

const validateNote = [
  body('title').notEmpty().withMessage('Title is required'),
  body('body').optional().isString().withMessage('Body must be a string'),
  body('category').optional().isString().withMessage('Category must be a string'),
];

module.exports = { validateNote };