const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');

const { Schema } = mongoose;


const fields = {
  estado: {
    type: Boolean,
  },
  idCiudad: {
    type: Schema.Types.ObjectId,
    ref: 'ciudad',
    require: true,
  },
  idMarca: {
    type: Schema.Types.ObjectId,
    ref: 'marca',
    require: true,
  },
  nombre: {
    type: String,
    require: true,
  },
  modulo_nivel: {
    type: String,
  },
  dias: [{
    type: String,
    require: false,
  }],
  //Presencial - Online
  modalidad: {
    type: String,
  },
  horaInicio: {
    type: String,
    require: false,
  },
  horaFin: {
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
const horario = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('horario', horario);

