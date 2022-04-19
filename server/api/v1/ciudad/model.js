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
  nombre: {
    type: String,
    require: false,
    uppercase: true,
  },
  email: {
    type: String,
    unique: true,
    lowecase: true,
    validator: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: (props) => `${props.value} no es un email valido`,
    },
  },
  codigoPostal: {
    type: String,
    require: false,
  },
  estado: {
    type: Boolean,
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
const ciudad = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('ciudad', ciudad);

