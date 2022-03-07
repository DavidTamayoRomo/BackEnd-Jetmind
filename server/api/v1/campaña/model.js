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

  estado: {
    type: String,
    require: false,
  },
  nombre: {
    type: String,
    require: false,
  },
  fecha_activacion: {
    type: Date,
    require: false,
  },
  fecha_finalizacion: {
    type: Date,
    require: false,
  },
  idMarca: {
    type: Schema.Types.ObjectId,
    ref: 'marca',
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
const campania = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('campania', campania);

