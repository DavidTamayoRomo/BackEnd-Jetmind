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

  idEstudiante: {
    type: Schema.Types.ObjectId,
    ref: 'estudiante',
    require: true,
  },
  idCiudad: {
    type: Schema.Types.ObjectId,
    ref: 'ciudad',
    require: false,
  },
  idMarca: {
    type: Schema.Types.ObjectId,
    ref: 'marca',
    require: false,
  },
  idDocente: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require: false,
  },
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
  pregunta7: {
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
const encuestapadres = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('encuestapadres', encuestapadres);

