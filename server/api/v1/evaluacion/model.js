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
  idDocente: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require: true,
  },
  idHorario: {
    type: Schema.Types.ObjectId,
    ref: 'horario',
    require: true,
  },
  idEstudiante: {
    type: Schema.Types.ObjectId,
    ref: 'estudiante',
    require: true,
  },
  idTipoPlataforma: {
    type: Schema.Types.ObjectId,
    ref: 'tipoplataforma',
    require: false,
  },
  comentario: {
    type: Date,
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
const evaluacion = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('evaluacion', evaluacion);

