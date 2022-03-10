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
  idDocente: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require: true,
  },
  fechaEntrega: {
    type: String,
    require: false,
  },
  libro: {
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
const entregalibro = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('entregalibro', entregalibro);

