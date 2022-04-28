const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');
const mongooseDateFormat = require('mongoose-date-format');

const { Schema } = mongoose;


const fields = {
  nombresApellidos: {
    type: String,
    require: true,
    maxlength: 128,
    uppercase: true,
  },
  email: {
    type: String,
    lowecase: true,
    /* validator: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: (props) => `${props.value} no es un email valido`,
    }, */
  },
  cedula: {
    type: String,
    require: true,
    //maxlength: 10
  },
  //Activo, Congelado, Incorporado, Retirado, Espera, Rechazado
  estado: {
    type: String
  },
  telefono: {
    type: String,
    require: false
  },
  fechaNacimiento: {
    type: Date,
    require: false
  },
  direccion: {
    type: String,
    require: false
  },
  genero: {
    type: String,
    require: false
  },
  //TODO: revisar q hay dos
  estado: {
    type: String,
    require: false
  },
  fotoCedula1: {
    type: String,
    require: false
  },
  fotoCedula2: {
    type: String,
    require: false
  },
  idRepresentante: [{
    type: Schema.Types.ObjectId,
    ref: 'representante',
    require: false
  }],
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
const estudiante = new Schema(fields, { timestamps: true });

//Cambiar formato de fecha formato solo fecha formato YYYY-MM-DD || si se desea cambiar debemos hacer clic + control en mongooseDateFormat 
estudiante.plugin(mongooseDateFormat);

module.exports = mongoose.model('estudiante', estudiante);

