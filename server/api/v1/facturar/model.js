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
    //require:true,
  },
  programa: [{
    type: Schema.Types.ObjectId,
    ref: 'programa',
    require: false,
  }],
  nombre: {
    type: String,
    require: false,
  },
  cedula_ruc: {
    type: Number,
    require: false,
  },
  telefono: {
    type: Number,
    require: false,
  },
  correo: {
    type: String,
    require: false,
  },
  direccion: {
    type: String,
    require: false,
  },
  total: {
    type: Number,
    require: false,
  },
  tarjetaCredito: {
    type: Boolean,
    require: false,
  },
  voucher: [{
    type: String,
    require: false,
  }],
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
const facturar = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('facturar', facturar);

