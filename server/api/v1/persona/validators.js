const { body, param } = require('express-validator');

const emailValidation = body('email').optional().isEmail().withMessage('Email inválido');

const signupValidations = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const signinValidations = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

const createPersonaValidations = [
  body('nombresApellidos').notEmpty().withMessage('nombresApellidos es obligatorio'),
  body('cedula').notEmpty().withMessage('cedula es obligatoria'),
  emailValidation,
];

const updatePersonaValidations = [
  param('id').isMongoId().withMessage('Id de persona inválido'),
  emailValidation,
];

module.exports = {
  signupValidations,
  signinValidations,
  createPersonaValidations,
  updatePersonaValidations,
};
