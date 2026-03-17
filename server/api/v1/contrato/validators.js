const { body, param } = require('express-validator');

const createContratoValidations = [
  body('fecha').notEmpty().withMessage('La fecha es obligatoria'),
  body('idRepresentante').notEmpty().withMessage('El representante es obligatorio'),
  body('valorTotal').optional().isNumeric().withMessage('valorTotal debe ser numérico'),
  body('valorMatricula').optional().isNumeric().withMessage('valorMatricula debe ser numérico'),
  body('numeroCuotas').optional().isNumeric().withMessage('numeroCuotas debe ser numérico'),
];

const updateContratoValidations = [
  param('id').isMongoId().withMessage('Id de contrato inválido'),
  body('estado').optional().isIn(['Aprobado', 'Rechazado', 'Espera']).withMessage('Estado inválido'),
  body('valorTotal').optional().isNumeric().withMessage('valorTotal debe ser numérico'),
];

const voucherValidations = [
  param('id').isMongoId().withMessage('Id de contrato inválido'),
  body('voucher').isArray({ min: 1 }).withMessage('voucher debe ser un arreglo con al menos un elemento'),
];

const reporteVentasValidations = [
  body('fechainicio').notEmpty().withMessage('fechainicio es obligatorio'),
  body('fechafin').notEmpty().withMessage('fechafin es obligatorio'),
  body('asesor').optional().isArray().withMessage('asesor debe ser un arreglo'),
  body('campania').optional().isArray().withMessage('campania debe ser un arreglo'),
];

module.exports = {
  createContratoValidations,
  updateContratoValidations,
  voucherValidations,
  reporteVentasValidations,
};
