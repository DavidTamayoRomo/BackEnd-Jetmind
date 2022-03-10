const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');

const { Schema } = mongoose;

const fields = {
  idDirector: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require: false,
  },
  idEstudiante: {
    type: Schema.Types.ObjectId,
    ref: 'estudiante',
    require: false,
  },
  idDocente: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require: false,
  },
  clave: {
    type: String,
    require: false,
  },
  pin: {
    type: String,
    require: false,
  },
  password: {
    type: String,
    require: false,
  },
  observaciones: {
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


const plataformailvem = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('plataformailvem', plataformailvem);

