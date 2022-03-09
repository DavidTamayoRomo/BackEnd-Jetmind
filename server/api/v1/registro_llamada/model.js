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
  fecha: {
    type: Date,
    require: false,
  },
  comenterio: {
    type: String,
    require: false,
  },
  numeroTelefonico: {
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
const registrollamada = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('registrollamada', registrollamada);

