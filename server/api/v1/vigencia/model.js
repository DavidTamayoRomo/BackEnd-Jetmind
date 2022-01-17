const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');

const mongooseDateFormat = require('mongoose-date-format');

const { Schema } = mongoose;

const fields = {
  idCiudad: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'ciudad'
  }],
  estado: {
    type: String,
  },
  fechaInicio: {
    type: Date,
    require: true,
  },
  fechaCierre: {
    type: Date,
    require: true,
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
const vigencia = new Schema(fields, { timestamps: true });

//Cambiar formato de fecha formato solo fecha formato YYYY-MM-DD || si se desea cambiar debemos hacer clic + control en mongooseDateFormat 
vigencia.plugin(mongooseDateFormat);

module.exports = mongoose.model('vigencia', vigencia);
