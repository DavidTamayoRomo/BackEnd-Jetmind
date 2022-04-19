const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');

const { Schema } = mongoose;


const fields = {

  idMarcas: [{
    type: Schema.Types.ObjectId,
    ref: 'marca'
  }],
  nombre: {
    type: String,
    require: true,
    uppercase: true,
  },
  sector: {
    type: String,
    require: true,
  },
  descripcion: {
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
const sucursal = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('sucursal', sucursal);

