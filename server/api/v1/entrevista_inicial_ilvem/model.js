const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');

const { Schema } = mongoose;
/*
const sanitizers = [
  body.apply(title).escape()
]
*/

const fields = {
  idContrato: {
    type: Schema.Types.ObjectId,
    ref: 'contrato',
    require: false
  },
  fecha: {
    type: String,
    require: false,
  },
  estudiantes1:
    [
      {
        observaciones: { type: String },
        fechaInicio: { type: Date },
        FechaIncorporacion: { type: Date },
        tiempoCapacitacion: { type: String },
        estudiantes: [
          {
            idEstudainte: { type: String },
            nombreEstudiante: { type: String },
            idDocente: [
              {
                item_id: { type: String },
                nombre: { type: String },
              }
            ],
            idHorario: [
              {
                item_id: { type: String },
                nombre: { type: String },
              }
            ],
          }
        ]
      }
    ],
  pregunta1: {
    type: String,
    require: false,
  },
  pregunta2: {
    type: String,
    require: false,
  },
  pregunta3: {
    type: String,
    require: false,
  },
  pregunta4: {
    type: String,
    require: false,
  },
  pregunta5: {
    type: String,
    require: false,
  },
  pregunta6: {
    type: String,
    require: false,
  },
  addedUser: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require: false,
  },
  modifiedUser: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require: false,
  },
};

//timestamps es created at - updated at
const entrevistainicialilvem = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('entrevistainicialilvem', entrevistainicialilvem);

